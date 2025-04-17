/*
#############################
||                         ||
||  HANDLE CONSENT EVENTS  ||
||                         ||
#############################
*/

export async function consent() {

    let detail = { detail: this.state.consentGroups };

    //###############################//
    // || CHECK ANALYTICS CONSENT || //
    //###############################//
    
    if (this.state.consentGroups.includes('Analytics')) {
        window.dispatchEvent(new CustomEvent("hb_consent_analytics", detail));
    }

    //################################//
    // || CHECK FUNCTIONAL CONSENT || //
    //################################//

    if (this.state.consentGroups.includes('Functional')) {
        window.dispatchEvent(new CustomEvent("hb_consent_functional", detail));
    }

    //###############################//
    // || CHECK TARGETING CONSENT || //
    //###############################//

    if (this.state.consentGroups.includes('Targeting')) {
        window.dispatchEvent(new CustomEvent("hb_consent_targeting", detail));
    }

    //###############################//
    // || CHECK SOCIAL CONSENT || //
    //###############################//

    if (this.state.consentGroups.includes('Social')) {
        window.dispatchEvent(new CustomEvent("hb_consent_social", detail));
    }

}