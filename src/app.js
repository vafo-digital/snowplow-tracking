//########################//
// || SNOWPLOW IMPORTS || //
//########################//

/* Import core Snowplow functionality  */

import { newTracker, setUserId, trackPageView, enableActivityTracking, addGlobalContexts } from "@snowplow/browser-tracker";
import { SnowplowEcommercePlugin, setEcommerceUser, setPageType } from '@snowplow/browser-plugin-snowplow-ecommerce';
import { PerformanceTimingPlugin } from '@snowplow/browser-plugin-performance-timing';
import { ClientHintsPlugin } from '@snowplow/browser-plugin-client-hints';
import { MediaTrackingPlugin } from '@snowplow/browser-plugin-media-tracking';
import { LinkClickTrackingPlugin, enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

import './js/listeners';

//############################//
// || DATA OBJECTS IMPORTS || //
//############################//

/* Dummy data for use in examples */

import { 
    consent, 
    customer, 
} from "./js/data";

async function initSnowplow() {

    //#####################################//
    // || INITIALISE SNOWPLOW VARIABLES || //
    //#####################################//

    /* 
    Connection to snowplow. 
    Local host example using snowplow micro.
    https://docs.snowplow.io/docs/data-product-studio/data-quality/snowplow-micro/basic-usage/
    */

    let collectorUrl = "http://localhost:9090/"
    let postPath = 'com.snowplowanalytics.snowplow/tp2'
    let appId = 'snowplow-demo-app'

    //######################//
    // || MANAGE CONSENT || //
    //######################//

    /*
        Manage tracking consent.
        this example checks if functional consent is true.
        If functional consent isn't granted, anonymoustracking mode is activated.
    */

    let eventMethod, anonymousTracking, stateStorageStrategy, respectDoNotTrack;

    if (consent.functional) {
        eventMethod = "post",
        anonymousTracking = false;
        stateStorageStrategy = "cookieAndLocalStorage";
        respectDoNotTrack = false;
    }
    else {
        eventMethod = "post",
        anonymousTracking = { withServerAnonymisation: true };
        stateStorageStrategy = "none";
        respectDoNotTrack = false;
    }

    //##########################//
    // || INITIALISE TRACKER || //
    //##########################//

    /* Initialise tracker with consent and config data. */
    console.log('init');
    newTracker('sp', collectorUrl, {
        // idService: "/cookie.php", // uncomment this when deploying to producttionm
        anonymousTracking: anonymousTracking,
        eventMethod: eventMethod,
        stateStorageStrategy: stateStorageStrategy,
        respectDoNotTrack: respectDoNotTrack,
        postPath: postPath,
        appId: appId,
        platform: 'web',
        discoverRootDomain: true,
        cookieSameSite: 'Lax',
        contexts: {
            webPage: true,
            session: true,
            browser: true
        },
        plugins: [ SnowplowEcommercePlugin(), PerformanceTimingPlugin(), ClientHintsPlugin(), MediaTrackingPlugin(), LinkClickTrackingPlugin() ]
    });

    //########################################//
    // || SET GLOBAL CONTEXTS AND TRACKERS || //
    //########################################//

    /* Sets custom poochandmut global contexts for consent and customer data */
    addGlobalContexts([{
        schema: 'iglu:com.poochandmutt/consent_object/jsonschema/1-0-0',
        data: consent
    }]);

    addGlobalContexts([{
        schema: 'iglu:com.poochandmutt/customer_object/jsonschema/1-0-1',
        data: customer
    }]);

    /* set anon id */ 
    await fetch('http://localhost:8080/anon_id.php', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
    .then(response => response.json())
    .then(response => {
        console.log('adding anon');
        addGlobalContexts([{
            schema: 'iglu:com.poochandmutt/user_ids/jsonschema/1-0-0',
            data: {
                anon: response.anon_id
            }
        }]);
    });

    /* Sets user id and ecommerce user */

    if(customer.id) {

        let payload = {
            id: customer.id,
            email: customer.email,
            is_guest: false
        };
        
        setUserId(customer.id);
        setEcommerceUser(payload);
    }

    /* Sets basic tracking for default page views and activity */

    enableActivityTracking({ 
        minimumVisitLength: 30, 
        heartbeatDelay: 10 
    });

    setPageType({
        type: "pdp" // home, plp, pdp, cart, checkout, thankyou, blog, article, landing etc
    });

    trackPageView();

    /* Track link clicks from allowed class list and return tag content for context */

    enableLinkClickTracking({ 
        pseudoClicks: true,
        options: {
            'allowlist': ['sp-track']
        },
        trackContent: true 
    });

}

initSnowplow();