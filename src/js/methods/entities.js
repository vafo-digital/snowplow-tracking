export function entities() {

    return {

        //#####################//
        // || SET USER DATA || //
        //#####################//

        /*
        // Get user information from <meta> tag added to the HTML.
        // Set state for user information.
        */

        setUser: async event => {

            let meta = document.querySelector('meta[pooch-customer]');

            if (meta.getAttribute('pooch-customer')) {
                this.state.user.id = meta.getAttribute('pooch-customer');
                this.state.user.name = meta.getAttribute('pooch-customer-name');
                this.state.user.email = meta.getAttribute('pooch-customer-email');
                this.state.user.is_guest = false;
            }
        },

        //####################//
        // || SET CUSTOMER || //
        //####################//

        /*
        // Set customer state.
        // Dummy data is used here for examples of guest and logged in customers.
        // This should be altered to obtain data from an external source.
        */        

        setCustomer: async event => {

            // GUEST USER
            /*
            this.state.customer = {
                "status":               "guest",
                "subscriber_status":    "inactive",
                "loyalty_segment":      "none",
            };
            */

            // LOGGED IN USER

            this.state.customer = {
                "status":               "logged-in",
                "subscriber_status":    "active",
                "loyalty_segment":      "none",
            };

        },

        //####################//
        // || SET CART || //
        //####################//

        /*
        // Set cart state.
        // Dummy data is used here.
        // This should be altered to obtain data from an external source.
        */     

        setCart: async event => {

            /*this.state.cart = await fetch('/cart.js')
                .then(cartResponse => cartResponse.json())
                .then(jsonResponse => {
                    return jsonResponse;
                });
            */

            let dummyCartState = {
                currency: "GBP",
                total_price: 6750,
                total_discount: 0,
                token: "Z2NwLWV1cm9wZS13ZXN0MzoVA?key=c4c4699d4f1b719a2ffe88dd"
            }
    
            this.state.cart = dummyCartState;

            this.state.cart.total = {
                price: this.state.cart.total_price / 100,
                discount: this.state.cart.total_discount / 100
            };

        },

        //#################//
        // || SET CLICK || //
        //#################//

        setClick: async event => {

            this.state.click = event;
    
        },

        setCheckout: async event => {
            
            let step;

            if (event.checkout.step == 'contact_information')     step = 1;
            else if (event.checkout.step == 'shipping_method')    step = 2;
            else if (event.checkout.step == 'payment_method')     step = 3;
            else if (event.checkout.step == 'review')             step = 4;
            else if (event.checkout.step == 'processing')         step = 5;
            else if (event.checkout.step == 'thank_you')          step = 6;
            

            this.state.checkout = event.checkout;
            this.state.checkout.step_index = step;

        },

        setOrder: async event => {

            this.state.order = event.order;
            let total_items = 0;
            let handle, product, item, variant;

            for(let i = 0; i < this.state.order.line_items.length; i++) {

                item = this.state.order.line_items[i];
                
                handle = event.handles[i];
                product = await fetch('/products/' + handle + '?view=meta-json')
                .then(response => response.json())
                .then(jsonResponse => {
                    return jsonResponse.product;
                })
                .catch((error) => {
                    return false;
                });;

                this.state.order.line_items[i].handle = handle;
                this.state.order.line_items[i].product_type  = product.product_type;
                this.state.order.line_items[i].inventory_status = 'oneoff';
                this.state.order.line_items[i].currency = this.state.order.currency;

                variant = product.variants.find(variant => {
                    return variant.sku == this.state.order.line_items[i].sku;
                });
                this.state.order.line_items[i].bundle_products = variant?.bundle_products || [];

                // Set final price
                let price = parseFloat(item.price);
                if (item.discount_allocations?.length && item.discount_allocations[0].application_type == 'script') {
                    price -= parseFloat(item.discount_allocations[0].amount);
                    this.state.order.line_items[i].discount_amount = parseFloat(item.discount_allocations[0].amount) || '';
                    this.state.order.line_items[i].discount_code = item.discount_allocations[0].description || '';
                }
                this.state.order.line_items[i].final_price = price;

                total_items += this.state.order.line_items[i].quantity;
            
            }

            this.state.order.payment_method = this.state.order.credit_card ? "credit_card" : "paypal";

            this.state.order.subtotal = this.state.order.total_price - this.state.order.total_tax;

            this.state.order.total_items = total_items;

        },

        setRefund: async event => {

            this.state.refund = event.refund;

        },

        //###################//
        // || SET PRODUCT || //
        //###################//

        setProduct: async event => {

            console.log(event, ' the event')

            this.state.product = {
                handle: event.product_id,
                title: event.product_name,
                product_type: event.product_type,
                price: event.product_price,
                currency: event.product_currency,
                position: event.product_position,
                sku: event.product_sku,
                variant_id: event.variant_id
            };
            
            console.log(this.state.product, ' state prod')

            this.state.product.list_name = event.list_name;
            this.state.product.creative = event.creative;
            this.state.product.quantity = event.quantity;
            
            //this.state.product.inventory_status = event.subscription ? 'subscription' : 'oneoff'
            this.state.product.inventory_status = event.inventory_status; // || 'oneoff';

        },

        //###################//
        // || SET PRODUCTS || //
        //###################//

        setProducts: async event => {

            this.state.products = event.products;

        },

        setCollection: async event => {

            this.state.collection = await fetch('/collections/' + event.handle + '.json')
                .then(response => response.json())
                .then(jsonResponse => {
                    return jsonResponse.collection;
                });

        },

        setCharge: async event => {

            this.state.charge = event.charge;

        },

        setSubscription: async event => {

            this.state.subscription = event.subscription;

        },

        setBlog: async event => {

            this.state.blog = window.schemaLayer[event.blog_schema];

        },

        setArticle: async event => {

            this.state.article = window.schemaLayer[event.article_schema];

        },

        setAuthor: async event => {

            this.state.author = window.schemaLayer[event.author_schema];

        },

        setForm: async event => {

            this.state.form = event;

        },

        setPoochProfile: async event => {

            this.state.pooch_profile = event;

        }

    }

}