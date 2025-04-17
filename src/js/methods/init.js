export async function init(event) {

    //##################//
    // || DEBUG MODE || //
    //##################//

    if (localStorage.getItem('debug') == 'true') {
        this.state.debug = true;
    }
    
    //####################//
    // || SAVE CONSENT || //
    //####################//

    this.state.consentGroups = event.groups;
    this.debug('consentGroups', event.groups);

    //####################//
    // || GET URL UTMS || //
    //####################//

    this.utms();

    //####################//
    // || INIT TRACKERS|| //
    //####################//

    this.snowplowCore().init();

    //#####################//
    // || ADD LISTENERS || //
    //#####################//

    this.listeners();

    //####################//
    // || ADD TRIGGERS || //
    //####################//

    await this.triggers();

    //###########################//
    // || SEND CONSENT EVENTS || //
    //###########################//

    this.consent();

    //###########################//
    // || SET CART ATTRIBUTES || //
    //###########################//

    //await this.attributes();

    //########################//
    // || SEND READY EVENT || //
    //########################//

    window.dispatchEvent(new CustomEvent("hb_trackers_ready"));
    
}