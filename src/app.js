import { newTracker, setUserId, trackPageView, enableActivityTracking, addGlobalContexts } from "@snowplow/browser-tracker";
import { SnowplowEcommercePlugin, setEcommerceUser } from '@snowplow/browser-plugin-snowplow-ecommerce';
import { PerformanceTimingPlugin } from '@snowplow/browser-plugin-performance-timing';
import { ClientHintsPlugin } from '@snowplow/browser-plugin-client-hints';
import { MediaTrackingPlugin } from '@snowplow/browser-plugin-media-tracking';
import { LinkClickTrackingPlugin, enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

console.log(newTracker);
console.log('test 2');