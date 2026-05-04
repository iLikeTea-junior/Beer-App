import { test, expect, request } from '@playwright/test';
import { loggedInRequest } from './helpers/loggedInRequest';

// --------------- Success Cases

test.describe("Should login successfully", () => {
    test("The token should be successfully created", async ({ request }) => {
        const res = await request.post("/users/login", {
            data: {
                userName: "user",
                password: "user"
            }
        });

        const body = await res.json();
        if (!body.auth) throw new Error('A token was not created (could not log in)');
    })
})

test.describe("Get a list of all users", () => {
    test("Should return a list of all users in the data", async ({ request }) => {
        const res = await loggedInRequest('user:user', '/users');

        const body = await res.json();
        expect(body.length).toBe(2);
    })
})

test.describe("Add a new user", () => {
    test("The new user should exist in the database", async ({ request }) => {
        const res = await loggedInRequest('admin:admin', { method: "POST", url: "/users", data: {
            userName: "Brock",
            password: "2212"
        }})

        const body = await res.json();
        expect(body.message).toBe("User was created successfully");

        const usersRes = await loggedInRequest("admin:admin", "/users");
        const usersRouteBody = await usersRes.json();
        expect(usersRouteBody.length).toBe(3);
    })
})

// -------------- Error Cases

test.describe("Adding a name that already exists should give a 406", () => {
    test("Should return the message 'The username is already in use'", async ({ request }) => {
        const res = await loggedInRequest('admin:admin', { method: "POST", url: "/users", data: {
            userName: "Brock",
            password: "2212",
            level: 1
        }});

        expect(res.status()).toBe(406);

        const body = await res.json();
        if (!body) throw new Error('No body was retrieved');
        expect(body.error).toBe('The username is already in use');
    })
})