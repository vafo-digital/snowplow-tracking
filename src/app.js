// CORE METHODS

import { snowplowCore } from "./js/snowplow/core";
import { init } from "./js/methods/init";
import { attributes } from "./js/methods/attributes";
import { consent } from "./js/methods/consent";
import { debug } from "./js/methods/debug";
import { entities } from "./js/methods/entities";
import { events } from "./js/methods/events";
import { listeners } from "./js/methods/listeners";
import { triggers } from "./js/methods/triggers";
import { utils } from "./js/methods/utils";
import { utms } from "./js/methods/utms";

// SNOWPLOW METHODS

import { snowplowBlog } from "./js/snowplow/blog";
import { snowplowSubs } from "./js/snowplow/subs";
import { snowplowEcom } from "./js/snowplow/ecom";
import { snowplowForm } from "./js/snowplow/form";
import { snowplowMedia } from "./js/snowplow/media";
 
/*
######################################################
||                                                  ||
||  SNOWPLOW OBJECT FOR MANAGING STATE AND METHODS  ||
||                                                  ||
######################################################
*/

const Snowplow = {
    state: {
        debug:      false,
        app:        'snowplow',
        version:    '1.0.0',
        cart:       {},
        attributes: {},
        user:       {},
        product:    {},
        collection: {},
        checkout:   {},
        awin: {
            account_id: "",
        },

        movableink: {
            account_id: "",
            loaded: false
        },

        snowplowConfig: {
            dev:        'http://localhost:9090/',
            collector:  'http://localhost:9090/',
            appId:      'Snowplow Demo',
            postPath:   'com.snowplowanalytics.snowplow/tp2'
        }
    },

    attributes,
    //cart,
    consent, // CHECK TRACKING CONSENT
    debug,
    entities,
    events,
    init, // INITIALISE SNOWPLOW
    listeners, // LISTEN FOR EVENTS TO TRACK
    //schemalayer,
    triggers,
    utms,
    utils,

    snowplowCore,
    snowplowBlog,
    snowplowEcom,
    snowplowSubs,
    snowplowForm,
    snowplowMedia,
    //snowplowFYF,
    //snowplowPoochProfile
}

/*
####################################################
||                                                ||
||  INITIALISE SNOWPLOW WHEN CONSENT IS OBTAINED  ||
||                                                ||
####################################################
*/

window.addEventListener("hb_consent_ready", function (event) {
    Snowplow.init(event.detail);
});

/*
#########################################
||                                     ||
||  SNOWLPLOW EVENT TRACKING EXAMPLES  ||
||                                     ||
#########################################
*/

//#############################//
// || OBTAIN COOKIE CONSENT || //
//#############################//

/*
//    Get cookie consent from cookie management
//    Provide them in the format below.
//    The groups must match
//   'Required', 'Functional', 'Analytics', 'Targeting'
*/

const CookieConsentObject = {
    groups: ['Required', 'Functional', 'Analytics', 'Targeting']
}

let hb_event = new CustomEvent("hb_consent_ready", { detail: CookieConsentObject });
window.dispatchEvent(hb_event);

//################################//
// || TRACK PRODUCT VIEW EVENT || //
//################################//

/*
//    To track product view event you must meet the product schema critera
//    iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0
//    https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0
*/

document.getElementById('product-view').addEventListener('click', () => {

    const ProductData = {
        product_id: "example-product-url",
        creative: "pdp",
        subscription: false,
        title: "Example product title",
        product_type: "one time",
        product_price: 10,
        product_currency: "GBP",
        product_sku: "EXAMPLESKU",
        variant_id: "variantid",
        category: "example category"
    }
	  
	let prodevent = new CustomEvent("hb_product_view", { detail: ProductData });
	window.dispatchEvent(prodevent);
});

//#########################################//
// || TRIGGER PRODUCT ADD TO CART EVENT || //
//#########################################//

/*
//    To track add to cart event you must meet the product schema critera
//    iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0
//    https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0
*/

document.getElementById('add-to-cart').addEventListener('click', () => {

    let detail = {
        product_id: "example-product-url",
        quantity: 4,
        creative: "pdp",
        subscription: false,
        title: "Example product title",
        product_type: "one time",
        product_price: 10,
        product_currency: "GBP",
        product_sku: "EXAMPLESKU",
        variant_id: "variantid",
      };
  
      let hb_event = new CustomEvent("hb_add_to_cart", { detail: detail });
      window.dispatchEvent(hb_event);
});

//###############################################//
// || TRIGGER PRODUCT MULTI ADD TO CART EVENT || //
//###############################################//

/*
//    To track multi add to cart event you must meet the product schema critera
//    iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0
//    https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0
*/

document.getElementById('multi-add-to-cart').addEventListener('click', () => {

    let products = [{
            product_id: "example-product-url",
            quantity: 4,
            creative: "pdp",
            subscription: false,
            title: "Example product title",
            product_type: "one time",
            product_price: 10,
            product_currency: "GBP",
            product_sku: "EXAMPLESKU",
            variant_id: "variantid",
        },
        {
            product_id: "example-product-two-url",
            quantity: 1,
            creative: "pdp",
            subscription: false,
            title: "Example product two title",
            product_type: "one time",
            product_price: 20,
            product_currency: "GBP",
            product_sku: "EXAMPLETWOSKU",
            variant_id: "variantidTWO",
        }
    ];

    let detail = {
        products: products
    }
  
    let hb_event = new CustomEvent("hb_add_to_cart_multi", { detail: detail });
    window.dispatchEvent(hb_event);
});

//#################################//
// || TRIGGER UPDATE CART EVENT || //
//#################################//

/*
//    To track cart update event you must meet the product schema critera
//    iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0
//    https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0
*/

document.getElementById('update-cart').addEventListener('click', () => {

    let detail = {
        product_id: "example-product-url",
        quantity: 1, // QUANTITY SET TO 0 WILL TRIGGER REMOVE FROM CART EVENT
        creative: "pdp",
        subscription: false,
        title: "Example product title",
        product_type: "one time",
        product_price: 10,
        product_currency: "GBP",
        product_sku: "EXAMPLESKU",
        variant_id: "variantid",
      };
 
      let cartevent = new CustomEvent("hb_update_cart", { detail: detail });
      window.dispatchEvent(cartevent);

});


//#################################//
// || TRIGGER PRODUCT CLICK || //
//#################################//

/*
//    To track product click event you must meet the product schema critera
//    iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0
//    https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0
*/

document.getElementById('product-click').addEventListener('click', () => {

    let detail = {
        handle: 'cart',
        creative: "quickbuy",
        list_name: 'Collection Page',
        product_id: "example-product-two-url",
        quantity: 1,
        subscription: false,
        title: "Example product two title",
        product_type: "one time",
        product_price: 20,
        product_currency: "GBP",
        product_sku: "EXAMPLETWOSKU",
        variant_id: "variantidTWO",
    };
 
      let prodevent = new CustomEvent("hb_product_click", { detail: detail });
      window.dispatchEvent(prodevent);

});