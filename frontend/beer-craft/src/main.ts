import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

function register_service_worker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => { // the load event fires when the whole page is loaded. This would be important since the SW could start intercepting requests to soon.
            navigator.serviceWorker.register('/sw.js')
            .then((reg) => {
                    console.log('Service worker registration succeeded:', reg);
                }, (err) => {
                    console.error(`Service worker registration failed: ${err}`);
                }
            )
        })
    } else {
        console.error('Service workers are not supported,');
    }
}

function unregister_service_worker() {
    navigator.serviceWorker.getRegistrations()
    .then((registrations: any) => {
        registrations.forEach((registration: any) => {
            registration.unregister();
            console.log('Service worker unregistered.')
        })
    })
    .catch(err => {
        console.log('Could not unregister service worker.')
    })
}

register_service_worker();
// unregister_service_worker();