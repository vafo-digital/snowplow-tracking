import { setPageType, trackPromotionClick, trackProductListClick, trackProductView, trackProductListView, trackAddToCart, trackRemoveFromCart, trackCheckoutStep, trackTransaction, trackRefund } from '@snowplow/browser-plugin-snowplow-ecommerce';

/*
###################################
||                               ||
||  SNOWPLOW ECOM EVENT METHODS  ||
||                               ||
###################################
*/

export function snowplowEcom() {

    return {

        //#############################//
        // || GET AND SET PAGE TYPE || //
        //#############################//

        pageType: () => {

            let payload = {
                type: this.state.page_type
            }

            this.debug('pageType', payload);

            setPageType(payload);

        },

        //###############################//
        // || HANDLE PROMOTION CLICKS || //
        //###############################//

        /*
        // Used for tracking click on promotions and providing context.
        */        

        promotionClick: async () => {
            
            let click = this.state.click;

            let payload = {
                id: click.promo_id,
                name: click.promo_name,
                type: click.promo_type,
                position: click.promo_position,
                creative_id: click.creative_id,
                context: [
                    this.snowplowEcom().setCartContext(this.state.cart),
                ]
            };

            this.debug('promotionClick', payload);

            trackPromotionClick(payload);
            
        },

        //#################################//
        // || HANDLE CATEGORY PAGE VIEW || //
        //#################################//

        /*
        // Used for tracking category page views.
        */

        collectionView: () => {
            
            let payload = {
                products: [],
                name: this.state.collection.title,
                context: [
                    this.snowplowEcom().setCartContext(this.state.cart),
                ]
            };

            this.debug('collectionView', payload);

            trackProductListView(payload);
            
        },

        //############################//
        // || HANDLE PRODUCT CLICK || //
        //############################//

        /*
        // Used for tracking product card click and provided context.
        */

        productClick: () => {

            console.log(this, ' this state in prod click')
            
            let payload = {
                product: this.snowplowEcom().setProductPayload(this.state.product),
                /*{
                    id: click.product_id,
                    name: click.product_name,
                    category: click.product_type,
                    price: click.product_price,
                    currency: click.product_currency,
                    position: click.product_position,
                },*/
                name: this.state.product.list_name,
                context: [
                    this.snowplowEcom().setCartContext(this.state.cart),
                ]
            }

            this.debug('productClick', payload);

            trackProductListClick(payload);
            
        },

        //################################//
        // || HANDLE PRODUCT PAGE VIEW || //
        //################################//

        /*
        // Used for tracking product page view and provided context.
        */

        productView: () => {

            let contexts = [
                this.snowplowEcom().setCartContext(this.state.cart),
                this.snowplowEcom().setProductContext(),
                //...this.snowplowEcom().setBundleProductsContext(this.state.product.variant.bundle_products)
            ];            

            let payload = {
                ...this.snowplowEcom().setProductPayload(this.state.product),
                context: contexts.filter(Boolean)
            };
        
            this.debug('productView', payload);
        
            trackProductView(payload);
            
        },

        //###################################//
        // || HANDLE ADD TO CART TRACKING || //
        //###################################//

        /*
        // Used for tracking add to cart events.
        */        

        addToCart: () => {

            let contexts = [
                this.snowplowEcom().setProductContext(),
                //...this.snowplowEcom().setBundleProductsContext(this.state.product.variant.bundle_products)
            ];

            console.log(this.state, ' add to cart state')

            let payload = {
                ...this.snowplowEcom().setCartPayload(this.state.cart),
                products: [this.snowplowEcom().setProductPayload(this.state.product)],
                context: contexts.filter(Boolean)
            };

            //this.debug('addToCart', payload);

            trackAddToCart(payload);

        },

        //#########################################//
        // || HANDLE MULTI ADD TO CART TRACKING || //
        //#########################################//

        /*
        // Used for tracking multi add to cart events.
        */  

        addToCartMulti: () => {

            // let contexts = [
            //     this.snowplowEcom().setProductContext(),
            //     ...this.snowplowEcom().setBundleProductsContext(this.state.product.variant.bundle_products)
            // ];
            // context: contexts.filter(Boolean)

            let payload = {
                ...this.snowplowEcom().setCartPayload(this.state.cart),
                products: this.snowplowEcom().setProductsPayload(this.state.products)
            };

            this.debug('addToCartMulti', payload);

            trackAddToCart(payload);

        },

        //########################################//
        // || HANDLE REMOVE FROM CART TRACKING || //
        //########################################//

        /*
        // Used for tracking remove from cart events.
        */  

        removeFromCart: (productJson, cartJson) => {
        
            let payload = {
                ...this.snowplowEcom().setCartPayload(this.state.cart),
                products: [this.snowplowEcom().setProductPayload(this.state.product)],
            };

            //this.debug('RemoveFromCart', payload);

            trackRemoveFromCart(payload);

        },

        checkoutStep: () => {

            if (!this.state.checkout.step_index) {
                return;
            }
            
            let payload = {
                step: this.state.checkout.step_index,
                account_type: this.state.user.id ? "existing" : "guest",
                context: [
                    this.snowplowEcom().setCartContext(this.state.cart),
                ]
            };

            //this.debug('checkoutStep', payload);

            trackCheckoutStep(payload);

        },

        orderComplete: () => {

            let order = this.state.order;

            let products = [];
            let bundles = [];

            order.line_items.forEach(line_item => {

                products.push(this.snowplowEcom().setProductPayload(line_item));
                bundles.push(...line_item.bundle_products);

            });

            let contexts = [
                {
                    schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0',
                    data: {
                        total_value: parseFloat(order.total_price),
                        currency: order.currency,
                        cart_id: order.cart_token
                    }
                },
                this.snowplowEcom().setBundleProductsContext(bundles)
            ];

            let payload = {
                transaction_id: order.order_id.toString(),
                revenue: parseFloat(order.total_price),
                currency: order.currency,
                payment_method: order.payment_method,
                total_quantity: order.total_items,
                tax: parseFloat(order.total_tax),
                shipping: parseFloat(order.shipping_rate.price),
                discount_code: order.discount?.code,
                discount_amount: parseFloat(order.discount?.amount),
                products: products,
                context: contexts.filter(Boolean)
            }

            //this.debug('orderCompleteSP', payload);

            trackTransaction(payload);

        },

        orderRefund: () => {

            let payload = {
                transaction_id: this.state.refund.transaction_id,
                currency: this.state.refund.currency,
                refund_amount: parseFloat(this.state.refund.refund_amount)
            };

            //this.debug('orderRefund', payload);

            trackRefund(payload);

        },

        //###################################//
        // || HANDLE SETTING CART CONTEXT || //
        //###################################//

        /*
        // Set conext for the cart.
        */          

        setCartContext: json => {

            return {
                schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0',
                data: this.snowplowEcom().setCartPayload(json)
            }
        
        },

        setCartPayload: json => {

            let cart = {
                total_value: json.total.price,
                currency: json.currency,
                cart_id: json.token,
            };

            return cart;

        },

        setProductsPayload: products => {

            let payload = [];

            products.forEach(prod => {

                payload.push(this.snowplowEcom().setProductPayload(prod));

            });

            return payload;

        },

        setProductPayload: json => {

            let product = {
                id: json.handle,
                name: json.title,
                brand: json.vendor,
                category: json.product_type,
                currency: json.currency,
                variant: json.sku,
                inventory_status: json.inventory_status,
                creative_id: json.creative || '',
            };

            if (json.final_price) {
                product.price = parseFloat(json.final_price);
                product.list_price = parseFloat(json.price);
            } else {
                product.price = parseFloat(json.price);
            }

            if (json.quantity) {
                product.quantity = json.quantity;
                if (product.quantity < 0) {
                    product.quantity = product.quantity * -1;
                }
            }

            return product;

        },

        setProductContext: () => {

            console.log(this, 'this contetn')
            return {
                schema: 'iglu:com.poochandmutt/product_object/jsonschema/1-0-3',
                data: { 
                    id: this.state.product.handle,
                    variant_id: this.state.product.variant_id.toString(),
                }
            };

        },

        setBundleProductsContext: bundle_products => {
                
            if (!bundle_products.length) {
                return [];
            }

            let payload = [];

            bundle_products.forEach(bundle_product => {

                payload.push({
                    schema: 'iglu:com.poochandmutt/bundle_product_object/jsonschema/1-0-1',
                    data: { 
                        parent: bundle_product.parent,
                        id: bundle_product.handle,
                        name: bundle_product.title,
                        category: bundle_product.product_type,
                        currency: this.state.cart.currency,
                        variant: bundle_product.sku,
                        price: bundle_product.price,
                        quantity: bundle_product.quantity
                    }
                });

            });

            return payload;

        },
        
    };

}