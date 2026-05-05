
const CACHE_VERSION = 1;
const CACHE_NAME = `app-cache-v${CACHE_VERSION}`;
let requestQueue = [];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll([
                    './',
                    './index.html',
                    './assets/main.css'
                ]);
            })
            .catch(err => console.log('Could not cache.', err))
    )
})

self.addEventListener('activate', () => {
    console.log('Service worker activated');
})

self.addEventListener('fetch', async (event) => {
    console.log("The listener is listening")
    if (event.request.method === 'POST' && new URL(event.request.url).pathname === '/api/likes') {
        event.respondWith(
            (async () => {
                const reqClone = event.request.clone();
                // when adding a like, it succeeds but it also fails for some reason.
                try {
                    const response = await fetch(reqClone.clone());
                    return response;
                } catch (err) {
                    requestQueue.push(reqClone.clone());
                    return new Response(JSON.stringify({ message: "Like is queued" }),
                        { headers: { "Content-Type": "application/json" } }
                    );
                }
            })()
        )
    }
})

setInterval(async () => {
    if (requestQueue.length === 0) return;

    for (const req of requestQueue) {
        try {
            await fetch(req.clone());
            requestQueue = requestQueue.filter(r => r !== req); // if the request did go through remove it.
        } catch (err) {
            continue
        }
    }
}, 3000)