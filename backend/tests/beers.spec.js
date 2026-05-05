import { test, expect, request } from "@playwright/test";
import { loggedInRequest } from "./helpers/loggedInRequest";

// ------------ Success Cases

test.describe("Add a new beer to the system", () => {
    test("Should add a beer successfully (1 more beer in the database)", async ({ request }) => {
        const beerData = {
            name: "Polar",
            percentage: 4.5,
            brewery: "Cerveceria Polar",
            category: "Pilsen"      
        }

        const res = await loggedInRequest('admin:admin', { method: 'POST', url: '/beers', data: beerData })
        const body = await res.json();
        expect(body.message).toBe("Beer has been created successfully");

        const beersRes = await loggedInRequest('admin:admin', "/beers");
        const beersBody = await beersRes.json();
        expect(beersBody.length).toBe(5);
    })
})

test.describe("Retrieve Beers (no order or filters)", () => {
    test("should return 4 beers initially", async ({ request }) => {
        const response = await request.get('/beers');

        const body = await response.json();
        const beersFound = body.length;
        expect(beersFound).toBe(4);
    });
})

test.describe("Retrieve Beers, ordered by popularity", () => {
    test("Should return a list sorted by lower to big", async ({ request }) => {
        const res = await request.get('/beers/?order=popularity');

        const body = await res.json();
        const firstBeer = body[0].popularity;
        const lastBeer = body[body.length - 1].popularity;

        if (lastBeer < firstBeer) throw new Error('The list sorted by popularity is incorrect')
    })
})

test.describe("Retrieve Beers filtered by category", () => {
    test("Should return only 1 beer, filtered by the category 'India Pale Ale'", async ({request}) => {
        const res = await request.get('/beers?category=India Pale Ale');

        const body = await res.json();
        expect(body.length).toBe(1);
        expect(body[0].category).toBe('India Pale Ale');
    })
})

test.describe("Remove a beer", () => {
    test("4 beers should be left", async ({ request }) => {
        await loggedInRequest('admin:admin', { method: 'DELETE', url: '/beers/5' })
        
        const res = await request.get('/beers');
        const body = await res.json();
        expect(body.length).toBe(4);
    })
})

// ------------ Error Cases

test.describe("Not adding a beer properly should return a 400", () => {
    test("Should return the message 'It is missing either name, percentage, brewery, or category'", async ({ request }) => {
        const res = await loggedInRequest('admin:admin', { method: 'POST', url: '/beers', data: {
            name: 'Something',
            percentage: 6.7,
            brewery: 'Nothing Really'
        }});

        expect(res.status()).toBe(400);

        const body = await res.json();
        if (!body) throw new Error('No body was retrieved');
        expect(body.error).toBe('It is missing either name, percentage, brewery, or category');
    })
})

test.describe('Not deleting a beer properly should return a 404', () => {
    test("Should return the message 'The beer was not found'", async () => {
        const res = await loggedInRequest('admin:admin', { method: 'DELETE', url: '/beers/10'})
        expect(res.status()).toBe(404);

        const body = await res.json();
        if(!body) throw new Error('No body was retrieved');
        expect(body.error).toBe('The beer was not found');
    })
})
