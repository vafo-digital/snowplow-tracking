export async function listeners() {

    window.addEventListener('hb_add_to_cart', event => {
  
      this.events().addToCart(event.detail);
  
    });
  
    window.addEventListener('hb_add_to_cart_multi', event => {
  
      this.events().addToCartMulti(event.detail);
  
    });
  
    window.addEventListener('hb_update_cart', event => {
  
      this.events().updateCart(event.detail);
  
    });
  
    window.addEventListener('hb_product_view', event => {
  
      this.events().productView(event.detail);
  
    });
  
    window.addEventListener('hb_subscription_update', event => {
  
      this.events().subscriptionUpdate(event.detail);
  
    });
  
    window.addEventListener('hb_order_complete', event => {
  
      this.events().orderComplete(event.detail);
  
    });
  
    window.addEventListener('hb_order_refund', event => {
  
      this.events().orderRefund(event.detail);
  
    });
  
    window.addEventListener('hb_promo_click', event => {
  
      this.events().promotionClick(event.detail);
  
    });
  
    window.addEventListener('hb_product_click', event => {
  
      this.events().productClick(event.detail);
  
    });
  
    window.addEventListener('hb_blog', event => {
  
      this.events().blog(event.detail);
  
    });
  
    window.addEventListener('hb_article', event => {
  
      this.events().article(event.detail);
  
    });
  
    window.addEventListener('hb_form', event => {
  
      this.events().form(event.detail);
  
    });
  
    window.addEventListener('hb_pooch_profile_action', event => {
  
      this.events().poochProfile(event.detail);
  
    });
  
    window.addEventListener('hb_update_schema_layer', event => {
  
      this.schemalayer();
  
    });
  
  }