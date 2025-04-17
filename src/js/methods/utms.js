export function utms() {

    // Get UTM values
    let urlParams = new URLSearchParams(window.location.search);

    // Set UTM values
    this.state.attributes.source = urlParams.get('utm_source');
    this.state.attributes.medium = urlParams.get('utm_medium');
    this.state.attributes.campaign = urlParams.get('utm_campaign');

    // Set Click ID values
    let urlclid;
    let clids = {
        "fbclid":   "Meta",
        "gclid":    "Google",
        "ttclid":   "TikTok",
        "awc":      "Awin",
        "_kx":      "Klaviyo"
    };

    for (let clid in clids)
    {
        urlclid = urlParams.get(clid);
        if (urlclid)
        {
            this.state.attributes.click_id = urlclid;
            this.state.attributes.network = clids[clid];
            if (!document.referrer.includes('poochandmutt.co.uk')) {
                this.state.attributes.referrer = document.referrer;
            }
            localStorage.setItem("click_id", urlclid);
            localStorage.setItem("network", clids[clid]);
        }
    }

}