export async function attributes() {

    //###########################//
    // || GET CART IF NOT SET || //
    //###########################//

    if (!this.state.cart.token) {
        await this.entities().setCart();
    }
     
    let attributes = {};
    
    this.state.attributes.cart_token = this.state.cart.token;
    
    //#########################################//
    // || DONT SET PAGE TYPE IF ALREADY SET || //
    //#########################################//

    let currentPageType = this.state.attributes.page_type;
    if (this.state.cart.attributes?.page_type) {
        this.state.attributes.page_type = false;
    }

    //#############################//
    // || SAVE CONSENT IN ORDER || //
    //#############################//

    this.state.attributes.consent = JSON.stringify(this.state.consentGroups);

    Object.entries(this.state.attributes).forEach(([param, value]) => {

        console.log(this.state, ' this state here')
        
        if (value && (this.state.cart.attributes[param] !== value || currentPageType == 'checkout')) {
            attributes[param] = value;
        }

    });

    if (Object.keys(attributes).length > 0) {
        await this.cart().update(attributes);
    }
}