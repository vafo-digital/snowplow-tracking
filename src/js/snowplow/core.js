// REQUIRED SNOWPLOW PACKAGES

import { newTracker, setUserId, trackPageView, enableActivityTracking, addGlobalContexts } from "@snowplow/browser-tracker";
import { SnowplowEcommercePlugin, setEcommerceUser } from '@snowplow/browser-plugin-snowplow-ecommerce';
import { PerformanceTimingPlugin } from '@snowplow/browser-plugin-performance-timing';
import { ClientHintsPlugin } from '@snowplow/browser-plugin-client-hints';
import { MediaTrackingPlugin } from '@snowplow/browser-plugin-media-tracking';
import { LinkClickTrackingPlugin, enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

export function snowplowCore() {

    return {

        init: () => {

            //###########################################//
            // || PROCESS FUNCTIONAL TRACKING CONSENT || //
            //###########################################//

            //https://snowplow.io/blog/cookieless-and-anonymous-tracking-with-snowplow/

            let eventMethod, anonymousTracking, stateStorageStrategy, respectDoNotTrack;

            if (this.state.consentGroups.includes('Functional')) {
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

            newTracker('sp', this.state.snowplowConfig.collector, {
                anonymousTracking: anonymousTracking,
                eventMethod: eventMethod,
                stateStorageStrategy: stateStorageStrategy,
                respectDoNotTrack: respectDoNotTrack,
                postPath: this.state.snowplowConfig.postPath,
                appId: this.state.snowplowConfig.appId,
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

            this.snowplowMedia().init();

            //###########################//
            // || LINK CLICK TRACKING || //
            //###########################//

            /*
            // Track links with classes set in the allowlist.
            */

            enableLinkClickTracking({ 
                pseudoClicks: true,
                trackContent: true,
                options: {
                    'allowlist': ['sp-track']
                  }

            });

            //#########################################//
            // || ADD GLOBAL CONSENT OBJECT CONTEXT || //
            //#########################################//

            /*
            // This is a custom schema.
            */

            addGlobalContexts([{
                schema: 'iglu:com.poochandmutt/consent_object/jsonschema/1-0-0',
                data: {
                    required: true,
                    functional: this.state.consentGroups.includes('Functional'),
                    analytics: this.state.consentGroups.includes('Analytics'),
                    social: this.state.consentGroups.includes('Social'),
                    targeting: this.state.consentGroups.includes('Targeting')
                }
            }]);

            //##########################//
            // || GET DOMAIN USER ID || //
            //##########################//

            let getSnowplowDuid = function(cookieName) {
                var cookieName = cookieName || '_sp_';
                var matcher = new RegExp(cookieName + 'id\\.[a-f0-9]+=([^;]+);?');
                var match = document.cookie.match(matcher);
                if (match && match[1]) {
                    var split = match[1].split('.');
                    return { 
                        'domain_userid': split[0], 
                        'domain_sessionidx': split[2], 
                        'domain_sessionid': split[5]
                    }
                } else {
                    return false;
                }
            }

            let spc = getSnowplowDuid();

            this.state.attributes.sp_sessionid = spc.domain_sessionid || '';
            this.state.attributes.sp_sessionidx = spc.domain_sessionidx || '';
            this.state.attributes.sp_userid = spc.domain_userid || '';

            let meta = document.querySelector("meta[pooch-customer]");
            if (meta) {
                meta.setAttribute('pooch-domain-userid', spc.domain_userid);
            }
        },

        //#######################//
        // || SET USER OBJECT || //
        //#######################//

        /*
        // Set user from state.
        // Adds context for logged in or guest customer.
        */

        setUser: () => {

            let user = this.state.user;

            if (user.id) {

                let payload = {
                    id: user.id,
                    email: user.email,
                    is_guest: user.is_guest
                };

                this.debug('setUser', payload);
                setUserId(user.id);
                setEcommerceUser(payload);
                this.state.attributes.account_type = "logged_in";

            } else {
                this.state.attributes.account_type = "guest";
            }

            if (this.state.customer) {
                addGlobalContexts([{
                    schema: 'iglu:com.poochandmutt/customer_object/jsonschema/1-0-1',
                    data: this.state.customer
                }]);
                this.debug('setCustomer', this.state.customer);
            }
            
        },

        //#####################################//
        // || TRACK DEFAULT PAGE VIEW EVENT || //
        //#####################################//

        pageView: () => {

            this.debug('trackPageView', {});

            enableActivityTracking({ 
                minimumVisitLength: 30, 
                heartbeatDelay: 10 
            });

            trackPageView();

        }        
    
    };

}