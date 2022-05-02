import fetch from 'node-fetch';
import { calculateDistance } from './utils.js';

var USER_API_URL = "https://fakestoreapi.com/users"
var CARTS_API_URL = "https://fakestoreapi.com/carts"
var PRODUCTS_API_URL = "https://fakestoreapi.com/products"

/**
 * Retrieves data from API URLs above.
 * @returns array of object datas: [userData, cartData, productData]
 */
async function retrieveData() {
    var userData = new Object();
    var cartData = new Object();
    var productData = new Object();
    let promiseUser = fetch(USER_API_URL)
        .then(res => res.json())
        .then(json => {
            // mapping json to an object of id: {objectElement}
            // because later on, some ids might be dislocated
            // e.g. id 56, id 57, id 61 (ids are no longer array idx+1)
            // and to find product by id, we just ___data[1]
            // instead of looping through all by filtering
            json.forEach(el => {
                userData[el.id] = el
            })
        }).catch(err => {
            throw new Error("Could not fetch User Data -> " + err)
        });
    let promiseCart = fetch(CARTS_API_URL)
        .then(res => res.json())
        .then(json => {
            // see above why this loop
            json.forEach(el => {
                cartData[el.id] = el
            })
        }).catch(err => {
            throw new Error("Could not fetch User Data" + err)
        });
    let promiseProduct = fetch(PRODUCTS_API_URL)
        .then(res => res.json())
        .then(json => {
            // see above why this loop
            json.forEach(el => {
                productData[el.id] = el
            })
        }).catch(err => {
            throw new Error("Could not fetch User Data" + err)
        });
    await Promise.all([promiseUser, promiseCart, promiseProduct]);
    return [userData, cartData, productData];
}

/**
 * Calculates sum of prices in each category
 * @param productData - product data object retrieved with retrieveData()
 * @returns object containing keys as category names and its total price
 */
function getTotalPricesByCategory(productData) {
    var categoriesTotals = new Object();
    for (var id in productData) {
        let categoryName = String(productData[id].category);
        if (categoriesTotals[categoryName] == undefined) {
            categoriesTotals[categoryName] = productData[id].price;
        }
        else {
            categoriesTotals[categoryName] += productData[id].price;
        }
    }
    return categoriesTotals;
}

/**
 * Calculate highest cart value and returns it with user data.
 * @param cartData - cart data object retrieved with retrieveData()
 * @param userData - user data object retrieved with retrieveData()
 * @param productData - product data object retrieved with retrieveData()
 * @returns object containing userId, cartId, user name object and its value
 */
function getHighestCartValueInfo(cartData, userData, productData) {
    var cartIdx = -1;
    var userIdx = -1;
    var maxValue = 0;
    for (var key in cartData) {
        let cartPrice = 0;
        cartData[key].products.forEach(el => {
            cartPrice += productData[el.productId].price * el.quantity;
        });
        if (cartPrice > maxValue) {
            maxValue = cartPrice;
            cartIdx = Number(key);
            userIdx = cartData[key].userId;
        }
    }
    return new Object({
        userId: userIdx,
        cartId: cartIdx,
        name: userData[userIdx].name,
        value: maxValue
    })

}
/**
 * Retrieves furthermost living users from user data, distance calculated from latitude and longtitude difference.
 * @param userData - user data object retrieved with retrieveData()
 * @returns object with data containing two users whose addresses are the most distant, and its value 
 */
function getFurthermostLivingUsers(userData) {
    var keys = Object.keys(userData);
    var user1;
    var user2;
    var maxDist = -1;
    for (var i = 0; i < keys.length - 1; i++) {
        for (var j = i + 1; j < keys.length; j++) {
            let testUser1 = userData[keys[i]];
            let testUser2 = userData[keys[j]];

            let lat1 = parseFloat(testUser1.address.geolocation.lat);
            let lon1 = parseFloat(testUser1.address.geolocation.long);
            let lat2 = parseFloat(testUser2.address.geolocation.lat);
            let lon2 = parseFloat(testUser2.address.geolocation.long);
            let dist = calculateDistance(lat1, lon1, lat2, lon2)
            if (dist > maxDist) {
                maxDist = dist;
                user1 = testUser1;
                user2 = testUser2;
            }
        }
    }
    return new Object({
        user1: user1,
        user2: user2,
        distance: maxDist
    })
}

// 1.
const [userData, cartData, productData] = await retrieveData();

// 2.
var categoriesTotals = getTotalPricesByCategory(productData);

// 3.
var highestCartValueInfo = getHighestCartValueInfo(cartData, userData, productData);

// 4.
var furthermostLivingusers = getFurthermostLivingUsers(userData);


export { retrieveData, getTotalPricesByCategory, getHighestCartValueInfo, getFurthermostLivingUsers };