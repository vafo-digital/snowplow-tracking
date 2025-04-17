export function events() {

    return {

        //###################//
        // || SET USER || //
        //###################//

        /*
        // Set user and customer.
        // Set entities and send to tracker.
        */

        setUser: async event => {
            await this.entities().setUser(event);
            await this.entities().setCustomer(event);
            this.snowplowCore().setUser();
        },

        //###################//
        // || PAGE VIEW || //
        //###################//

        /*
        // Send page view to trackers.
        */

        pageView: async event => {
            this.snowplowCore().pageView();
        },

        //###################//
        // || PAGE TYPE || //
        //###################//

        /*
        // Set page type state.
        // Send to trackers
        */

        pageType: async event => {  
            this.state.page_type = event.type;
            this.snowplowEcom().pageType();
        },

        //#######################//
        // || PROMOTION CLICK || //
        //#######################//

        /*
        // Set click.
        // Send to trackers
        */

        promotionClick: async event => {
            await this.entities().setClick(event);
            this.snowplowEcom().promotionClick();
        },

        //#####################//
        // || PRODUCT CLICK || //
        //#####################//

        /*
        // Set cart.
        // Set product.
        // Send to trackers.
        */

        productClick: async event => {
            await this.entities().setCart(event);
            await this.entities().setProduct(event);
            this.snowplowEcom().productClick();
        },

        //####################//
        // || PRODUCT VIEW || //
        //####################//

        /*
        // Set cart.
        // Set product.
        // Send to trackers.
        */

        productView: async event => {
            await this.entities().setCart(event);
            await this.entities().setProduct(event);
            this.snowplowEcom().productView();
        },

        //#######################//
        // || COLLECTION VIEW || //
        //#######################//

        /*
        // Set cart.
        // Set product.
        // Send to trackers.
        */

        collectionView: async event => {
            await this.entities().setCart(event);
            await this.entities().setCollection(event);
            this.snowplowEcom().collectionView();
        },

        //###################//
        // || ADD TO CART || //
        //###################//

        /*
        // Set cart.
        // Set product.
        // Send to trackers.
        */        

        addToCart: async event => {
            await this.entities().setCart(event);
            await this.entities().setProduct(event);
            this.snowplowEcom().addToCart();
        },

        //#########################//
        // || ADD TO CART MULTI || //
        //#########################//

        /*
        // Set cart.
        // Set product.
        // Send to trackers.
        */

        addToCartMulti: async event => {
            await this.entities().setCart(event);
            await this.entities().setProducts(event);
            this.snowplowEcom().addToCartMulti();
        },

        //######################//
        // || UPDATE TO CART || //
        //######################//

        /*
        // Set cart.
        // Set product.
        // Check if is remove from cart action with quantity 0
        // Send to trackers.
        */        

        updateCart: async event => {
            await this.entities().setCart(event);
            await this.entities().setProduct(event);
            if (event.quantity > 0) {
                this.snowplowEcom().addToCart();
            } else {
                this.snowplowEcom().removeFromCart();          
            }
        },

        //#########################//
        // || GET CHECKOUT STEP || //
        //#########################//

        /*
        // Set cart.
        // Set checkout.
        // Send to trackers.
        */     

        checkoutStep: async event => {
            this.debug('checkoutStep', event);
            await this.entities().setCart();
            await this.entities().setCheckout(event);
            this.snowplowEcom().checkoutStep();
        },

        //#########################//
        // || ORDER COMPLETE || //
        //#########################//

        /*
        // Set order.
        // Send to trackers.
        */   
        
        orderComplete: async event => {

            this.debug('orderCompleteEvent', event);

            await this.entities().setOrder(event);

            // if (localStorage.getItem('hboid') == this.state.order.order_id) {
            //     this.debug('orderCompleteEvent', 'Not firing duplicate order');
            //     return;
            // }
            // localStorage.setItem('hboid', this.state.order.order_id);

            //this.snowplowEcom().orderComplete();
            //this.awinCore().orderComplete();
            //this.bingCore().orderComplete();
            //this.gtmCore().orderComplete();
            //this.miCore().orderComplete();
            //this.tiktokCore().orderComplete();

        },

        //#########################//
        // || ORDER REFUND || //
        //#########################//

        /*
        // Set refund.
        // Send to trackers.
        */   

        orderRefund: async event => {
            this.debug('orderRefundEvent', event);
            await this.entities().setRefund(event);
            this.snowplowEcom().orderRefund();
        },

        //###########################//
        // || SUBSCRIPTION UPDATE || //
        //###########################//

        /*
        // Set charge.
        // Set subscription
        // Send to trackers.
        */   

        subscriptionUpdate: async event => {
            await this.entities().setCharge(event);
            await this.entities().setSubscription(event);
            this.snowplowSubs().subscriptionUpdate(event.type);
        },

        //#########################//
        // || BLOG VIEW EVENT || //
        //#########################//

        /*
        // Set blog.
        // Send to trackers.
        */           

        blog: async event => {
            await this.entities().setBlog(event);
            this.snowplowBlog().blog(event.type);
        },

        //###########################//
        // || ARTICLE VIEW EVENT  || //
        //###########################//

        /*
        // Set blog.
        // Set article.
        // Set author.
        // Send to trackers.
        */   

        article: async event => {
            await this.entities().setBlog(event);
            await this.entities().setArticle(event);
            await this.entities().setAuthor(event);
            this.snowplowBlog().article(event.type, event.name);
        },

        //#########################//
        // || AUTHOR || //
        //#########################//

        /*
        // Set author.
        // Send to trackers.
        */           

        author: async event => {
            await this.entities().setAuthor(event);
            this.snowplowBlog().author(event.type, event.name);
        },

        //################//
        // || SET FORM || //
        //################//

        /*
        // Set form.
        // Send to trackers.
        */           

        form: async event => {
            await this.entities().setForm(event);
            this.snowplowForm().track();
        },

        poochProfile: async event => {

            await this.entities().setPoochProfile(event);

            this.snowplowPoochProfile().track();

        },

    }

}