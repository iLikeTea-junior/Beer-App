import { test, request } from "@playwright/test";

// The tokenCache is just for speeding up tests. It works fine without,
// but bcrypt is intentionally pretty slow.
const tokenCache = {};

// Reset the database before each test.
test.beforeEach(async ({ request }) => {
    await request.put("/reset_database");
});

/**
 * loggedInRequest
 *
 * Makes a request as an authenticated user.
 * Usage:
 *   await loggedInRequest("user", "/some_url")
 *   await loggedInRequest("user:pass", { method: "POST", url: "/foo", data: {...} })
 *
 * - Automatically logs in the first time with a POST to /auth
 * - Reuses the token for future calls
 * - Adds the Authentication header
 */
export async function loggedInRequest(userPassword, obj) {
    // User name and password, separated by a ':'
    let [user, password] = userPassword.split(":");
    // Assume the password is the same as the user name, if unspecified
    if (!password) password = user;

    const key = `${user}:${password}`;

    if (!tokenCache[key]) { // if there is no key
        const loginContext = await request.newContext();
        const res = await loginContext.post('/users/login' /* TODO: Auth URL */, {
            /* TODO: The body to send */
            data: {
                userName: user,
                password: password
            }
        });

        if (!res.ok()) throw new Error(`Login failed: ${res.status()}`);

        const body = await res.json();
        tokenCache[key] = body.auth;
        await loginContext.dispose();
    }

    // Support string shorthand for GET requests
    if (typeof obj === "string") {
        obj = { url: obj };
    }

    const method = (obj.method || "GET").toLowerCase();
    const url = obj.url;
    obj.headers = obj.headers || {};

    obj.headers["Authorization"] = `Bearer ${tokenCache[key]}`;
    
    /* TODO: Add the auth token to your headers, the token was stored in `tokenCache[key]` */ 

    const apiContext = await request.newContext();
    return apiContext[method](url, obj);
}
