import { trackSelfDescribingEvent } from "@snowplow/browser-tracker";

export function snowplowSubs() {

    return {

        subscriptionUpdate: (event_type) => {

            let sub = this.state.subscription;
            let charge = this.state.charge;

            let code = false;
            if (charge && charge.discounts.length) {
                code = charge.discounts[0].code;
            } else if (charge && charge.removed_discount) {
                code = charge.removed_discount;
            }

            let subscription = {
                id: sub.id,
                product_id: sub.product_id,
                sku: sub.sku,
                quantity: sub.quantity,
                price: parseFloat(sub.price),
                frequency: sub.order_interval_frequency,
                frequency_unit: sub.order_interval_unit,
                next_date: sub.next_charge_scheduled_at,
                customer_id: sub.customer_id,
                address_id: sub.address_id,
                payment_id: sub?.include?.address.payment_method_id,
                payment_type: charge?.payment_type || null,
                discount: code || null,
                total_orders: sub.total_orders,
                last_order_id: sub.last_order_id,
                cancelled_at: sub.cancelled_at,
                cancelled_reason: sub.cancellation_reason,
                cancelled_comments: sub.cancellation_reason_comments
            };

            trackSelfDescribingEvent({
                event: {
                    schema: 'iglu:com.poochandmutt/subscription_action/jsonschema/1-0-2',
                    data: {
                        type: event_type
                    }
                },
                context: [{
                    schema: 'iglu:com.poochandmutt/subscription_object/jsonschema/1-1-4',
                    data: subscription
                }]
            });

        },

        
    
    };

}