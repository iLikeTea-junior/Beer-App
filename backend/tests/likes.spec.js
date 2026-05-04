import { test, expect, request } from '@playwright/test';
import { loggedInRequest } from './helpers/loggedInRequest';


// ------------- Success Cases

test.describe("Get a list of beers liked by a specific user", () => {
    test("Should return a list of liked beers", async () => {
        const res = await loggedInRequest('user:user', { method: 'GET', url: '/likes/user'})

        const body = await res.json();
        expect(body.length).toBe(2);
    })
})

test.describe("Add a like to a beer", () => {
    test("Should successfully add a like to a beer", async () => {
        const res = await loggedInRequest('user:user', { method: "POST", url: "/likes", data: {
            userName: 'user',
            beerId: 3
        }});

        const body = await res.json();
        expect(body.message).toBe('Like has been added');

        const resLikes = await loggedInRequest('user:user', { method: 'GET', url: '/likes/user' })
        const likesBody = await resLikes.json();
        expect(likesBody.length).toBe(3);
    })
})

test.describe("Remove a like from a beer", () => {
    test("The beer that was 'unliked' should not be present in the list of likes", async () => {
        // this works but for some reason says that it is missing a userName the Id
        const res = await loggedInRequest('user:user', { method: 'DELETE', url: '/likes', params: {
            userName: 'user',
            beerId: 3
        }});

        const body = await res.json();
        expect(body.message).toBe('Successfully removed a like');

        const getLikedRes = await loggedInRequest('user:user', { method: 'GET', url: '/likes/user'});
        const likesBody = await getLikedRes.json();
        expect(likesBody.length).toBe(2);
    })
}) 

// ------------ Error Cases

test.describe("Should return a 404 if user was not found", () => {
    test("Should return the message 'User not found'", async () => {
        const res = await loggedInRequest('user:user', 'likes/anonymous')
        expect(res.status()).toBe(404);

        const body = await res.json();
        expect(body.error).toBe("User not found");
    })
})

test.describe("Should return a 409 if the like already exists", () => {
    test("Should return the message 'Like already exists'", async () => {
        const res = await loggedInRequest('user:user', { method: 'POST', url: '/likes', data: {
            userName: 'user',
            beerId: 1
        }});

        expect(res.status()).toBe(409);

        const body = await res.json();
        expect(body.error).toBe('Like already exists');
    })
})

test.describe('Should return a 404 if could not remove a like', () => {
    test("Should return the message 'Could not remove like'", async () => {
        const res = await loggedInRequest('user:user', { method: 'DELETE', url: '/likes', data: {
            userName: 'user',
            beerId: 10
        }});

        expect(res.status()).toBe(404);
        const body = await res.json();
        expect(body.error).toBe('Beer not found');
    })
})