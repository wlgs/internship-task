import { createRequire } from 'module';
import * as f from "../src/fetch.js";

const require = createRequire(import.meta.url);

var USER_API_URL = "../__mock__/users.json"
var CARTS_API_URL = "../__mock__/carts.json"
var PRODUCTS_API_URL = "../__mock__/products.json"

var userData = require(USER_API_URL);
var productData = require(PRODUCTS_API_URL);
var cartData = require(CARTS_API_URL);

test('getTotalPricesByCategory returns correct sums object', () => {
    const correctResultObj = {
        "men's clothing": 204.23,
        "jewelery": 883.98,
        "electronics": 1994.99,
        "women's clothing": 157.72
    };
    const objTested = f.getTotalPricesByCategory(productData)
    expect(objTested).toBeDefined();
    for (var key in correctResultObj) {
        expect(objTested[key]).toBeDefined();
        expect(objTested[key]).toBeCloseTo(correctResultObj[key]);
    }

})

test('getHighestCartValueInfo returns correct cart id, user id and value', () => {
    const correctUserId = 4;
    const correctCartId = 5;
    const correctValue = 2015;
    const objTested = f.getHighestCartValueInfo(cartData, userData, productData)
    console.log(objTested);
    expect(objTested).toBeDefined();
    expect(objTested["userId"]).toBeDefined();
    expect(objTested["cartId"]).toBeDefined();
    expect(objTested["value"]).toBeDefined();
    expect(objTested["userId"]).toBe(correctUserId);
    expect(objTested["cartId"]).toBe(correctCartId);
    expect(objTested["value"]).toBeCloseTo(correctValue);
})

test('getFurthermostLivingUsers returns correct users and distance', () => {
    const correctUser1Id = 1;
    const correctUser2Id = 5;
    const correctDistance = 15012;
    const objTested = f.getFurthermostLivingUsers(userData)
    console.log(objTested);
    expect(objTested).toBeDefined();
    expect(objTested["user1"]).toBeDefined();
    expect(objTested["user2"]).toBeDefined();
    expect(objTested["distance"]).toBeDefined();
    expect(objTested["user1"].id).toBe(correctUser1Id);
    expect(objTested["user2"].id).toBe(correctUser2Id);
    expect(objTested["distance"]).toBeCloseTo(correctDistance, 0);
})