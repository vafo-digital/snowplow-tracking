//###################################//
// || SNOWPLOW ECOM EVENT IMPORTS || //
//###################################//

/* Import Snowplow ecommerce functionality - This provides prebuild ecommerse events and context schema
   Schema list - https://iglucentral.com/ 
*/

import { trackSelfDescribingEvent } from "@snowplow/browser-tracker";
import { enableMediaTracking } from '@snowplow/browser-plugin-media-tracking';

import { 
    setPageType, 
    trackPromotionClick, 
    trackProductListClick, 
    trackProductView,
    trackProductListView, 
    trackAddToCart, 
    trackRemoveFromCart, 
    trackCheckoutStep, 
    trackTransaction, 
    trackRefund 
} from '@snowplow/browser-plugin-snowplow-ecommerce';

//############################//
// || DATA OBJECTS IMPORTS || //
//############################//

/* Dummy data for use in examples */

import { 
    customer, 
    product, 
    cart, 
    promoClick, 
    subscription, 
    transaction, 
    blog, 
    article, 
    author,
    form 
} from "./data";

//#######################//
// || EVENT LISTENERS || //
//#######################//

/*
// TRIGGER PAGE TYPE EVENT
// This add the page type to the context.
*/

document.getElementById('page-type').addEventListener('click', () => {      

    let payload = {
        type: "Example page type"
    }

    setPageType(payload);
});

/*
// TRIGGER PRODUCT VIEW EVENT
// CONTEXT: Cart, product and the custom product_object.
*/

document.getElementById('product-view').addEventListener('click', () => {

    let contexts = [
        {
            schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0',
            data: cart
        },
        {                
            schema: 'iglu:com.poochandmutt/product_object/jsonschema/1-0-3',
            data: { 
                id: product.id,
                variant_id: product.variant,
            }
        }
    ];            

    let payload = {
        ...product,
        context: contexts
    };

    trackProductView(payload);
});

/* 
// TRIGGER PRODUCT LIST VIEW EVENT.
// CONTEXT: Cart, product and the custom product_object.
// Requires: Collection Name.
*/

document.getElementById('product-list-view').addEventListener('click', () => {

    let contexts = [
        {
            schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0',
            data: cart
        },
        {                
            schema: 'iglu:com.poochandmutt/product_object/jsonschema/1-0-3',
            data: { 
                id: product.id,
                variant_id: product.variant,
            }
        }
    ];       
    
    let payload = {
        products: [product],
        name: "Collection title",
        context: contexts
    };

    trackProductListView(payload);
});

/*
// TRIGGER PRODUCT CLICK
// CONTEXT: Cart, product and the custom product_object.
// Requires: List name (This is used to identify where the product was located)
*/

document.getElementById('product-click').addEventListener('click', () => {

    let contexts = [
        {
            schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0',
            data: cart
        },
        {                
            schema: 'iglu:com.poochandmutt/product_object/jsonschema/1-0-3',
            data: { 
                id: product.id,
                variant_id: product.variant,
            }
        }
    ];            

    let payload = {
        product: product,
        name: "List Name",
        context: contexts
    }

    trackProductListClick(payload);
});

/*
// TRIGGER ADD TO CART EVENT
// CONTEXT: Cart, product and the custom product_object.
// Multi add to cart can be handled by passing multiple product to the products array.
*/

document.getElementById('add-to-cart').addEventListener('click', () => {

    let contexts = [
        {                
            schema: 'iglu:com.poochandmutt/product_object/jsonschema/1-0-3',
            data: { 
                id: product.id,
                variant_id: product.variant,
            }
        }
    ];

    let payload = {
        total_value: cart.total_value,
        currency: cart.currency,
        products: [product,product],
        context: contexts
    };

    trackAddToCart(payload);
});

/*
// TRIGGER REMOVE FROM CART EVENT
// CONTEXT: Cart, product and the custom product_object.
*/

document.getElementById('remove-from-cart').addEventListener('click', () => {

    let contexts = [
        {                
            schema: 'iglu:com.poochandmutt/product_object/jsonschema/1-0-3',
            data: { 
                id: product.id,
                variant_id: product.variant,
            }
        }
    ];

    let payload = {
        total_value: cart.total_value,
        currency: cart.currency,
        products: [product],
        context: contexts
    };

    trackRemoveFromCart(payload)
});

/*
// TRIGGER PROMOTION CLICK EVENT
// CONTEXT: Promotion click object.
*/

document.getElementById('promo-click').addEventListener('click', () => {

    let contexts = [
        {                
            schema: 'iglu:com.poochandmutt/product_object/jsonschema/1-0-3',
            data: { 
                id: product.id,
                variant_id: product.variant,
            }
        }
    ];

    let payload = {
        ...promoClick,
        context: contexts
    };

    trackPromotionClick(payload)
});

/*
// TRIGGER CHECKOUT STEP TRACKER
// CONTEXT: Cart, current step and account type
*/

document.getElementById('checkout-step').addEventListener('click', () => {

    let contexts = [
        {
            schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0',
            data: cart
        },
    ];

    let payload = {
        step: 1,
        account_type: customer.id ? "existing" : "guest",
        context: contexts
    };

    trackCheckoutStep(payload);
});

/*
// TRIGGER TRANSACTION TRACKER
// CONTEXT: Cart
*/

document.getElementById('transaction').addEventListener('click', () => {

    let contexts = [
        {
            schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0',
            data: cart
        },
    ];

    let payload = {
        ...transaction,
        products: [product, product],
        context: contexts
    }

    trackTransaction(payload);

});

/*
// TRIGGER REFUND TRACKER
// REQUIRES TRANSACTION ID, CURRENCY AND REFUND AMOUNT
*/

document.getElementById('refund').addEventListener('click', () => {

    let payload = {
        transaction_id: transaction.id,
        currency: transaction.currency,
        refund_amount: 100
    };

    trackRefund(payload);

});

/*
// TRIGGER BLOG VIEW
// REQUIRES BLOG OBJECT AND EVENT TYPE
*/

document.getElementById('blog-view').addEventListener('click', () => {

    let contexts = [
        {
            schema: 'iglu:com.poochandmutt/blog_object/jsonschema/1-0-0',
            data: blog
        } 
    ];

    let payload = {
        event: {
            schema: 'iglu:com.poochandmutt/blog_action/jsonschema/1-0-1',
            data: {
                type: "blog_view"
            }
        },
        context: contexts
    }

    trackSelfDescribingEvent(payload);

});

/*
// TRIGGER ARTICLE VIEW
// REQUIRES BLOG OBJECT, ARTICLE, AUTHOR AND EVENT TYPE
*/

document.getElementById('article-view').addEventListener('click', () => {

    let contexts = [
        {
            schema: 'iglu:com.poochandmutt/blog_object/jsonschema/1-0-0',
            data: blog
        },
        {
            schema: 'iglu:com.poochandmutt/article_object/jsonschema/1-0-0',
            data: article
        },
        {
            schema: 'iglu:com.poochandmutt/author_object/jsonschema/1-0-0',
            data: author
        }
    ];

    let payload = {
        event: {
            schema: 'iglu:com.poochandmutt/blog_action/jsonschema/1-0-1',
            data: {
                type: "article_view",
                name: "Article View"
            }
        },
        context: contexts
    }

    trackSelfDescribingEvent(payload);

});

/*
// TRIGGER BLOG VIEW
// REQUIRES BLOG OBJECT AND EVENT TYPE
*/

document.getElementById('blog-view').addEventListener('click', () => {

    let contexts = [
        {
            schema: 'iglu:com.poochandmutt/blog_object/jsonschema/1-0-0',
            data: blog
        } 
    ];

    let payload = {
        event: {
            schema: 'iglu:com.poochandmutt/blog_action/jsonschema/1-0-1',
            data: {
                type: "blog_view"
            }
        },
        context: contexts
    }

    trackSelfDescribingEvent(payload);

});

/*
// TRIGGER SUBSCRIPTION
// REQUIRES SUBSCRIPTION OBJECT AND EVENT TYPE
*/

document.getElementById('subscription').addEventListener('click', () => {

    let contexts = [
        {
            schema: 'iglu:com.poochandmutt/subscription_object/jsonschema/1-1-4',
            data: subscription
        }
    ]

    let payload = {
        event: {
            schema: 'iglu:com.poochandmutt/subscription_action/jsonschema/1-0-2',
            data: {
                type: "add_subscription"
            }
        },
        context: contexts
    }

    trackSelfDescribingEvent(payload);

});

/*
// TRIGGER FORM EVENT
// REQUIRES: Form object and form event type.
*/

document.getElementById('form_event').addEventListener('click', () => {

    let contexts = [
        {
            schema: 'iglu:com.poochandmutt/form_object/jsonschema/1-0-0',
            data: form
        }
    ];

    let payload = {
        event: {
            schema: 'iglu:com.poochandmutt/form_action/jsonschema/1-0-0',
            data: {
                type: "form_event"
            }
        },
        context: contexts
    }

    trackSelfDescribingEvent(payload);

});