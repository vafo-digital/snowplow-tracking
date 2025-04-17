export async function triggers() {

    let url = window.location.pathname;
    let urlParams = new URLSearchParams(window.location.search);
    let handle = document.querySelector('body').getAttribute('pooch-handle');
    let template = document.querySelector('body').getAttribute('pooch-template');
    let suffix = document.querySelector('body').getAttribute('pooch-suffix');
    let customerId = 'example user';
    let pageType;

    await this.events().setUser({
        id: customerId
    });

    //##################################//
    // || SET PAGE TYPE BASED ON URL || //
    //##################################//

    if (url.includes('/cart')) {
        pageType = 'cart';
    }
    else if (url.includes('/account')) {
        pageType = 'account';
    }
    else if (url.includes('/checkout')) {
        pageType = 'checkout';
    }
    else if (url.includes('/orders')) {
        pageType = 'thankyou';
    }
    else if (url.includes('/collections')) {
        pageType = 'plp';
    }
    else if (url.includes('/products')) {
        pageType = 'pdp';
    }
    else if (url.includes('/blogs/authors')) {
        pageType = 'author';
    }
    else if (url.includes('/blogs')) {
        pageType = template;
    }
    else if (url.includes('/pages')) {

        if (suffix?.includes('landing')) {
            pageType = 'landing';
        } else {
            pageType = 'page';
        }
        
    }
    else if (url.includes('/search')) {
        pageType = 'search';
    }
    else if (template == "404") {
        pageType = '404';
    }
    else if (url == '/') {
        pageType = 'homepage';
    }

    if (pageType) {
        this.state.attributes.page_type = pageType;
        this.events().pageType({
            type: pageType
        });
    }

    this.events().pageView({
        handle: handle
    });

    if (pageType == 'plp') {
        this.events().collectionView({
            handle: handle
        });
    }

    if (pageType == 'pdp') {
        this.events().productView({
            handle: handle,
            creative: 'pdp'
        });
    }

    if (pageType == 'checkout') {
        this.events().checkoutStep({
            checkout: Shopify.Checkout
        });
    }

    if (pageType == 'blog') {

        this.events().blog({
            blog_schema: 'blog',
            type: 'blog_view',
        });

    }

    if (pageType == 'article') {

        this.events().article({
            blog_schema: 'blog',
            article_schema: 'article',
            author_schema: 'author',
            type: 'article_view',
        });

        if (urlParams.get('comment')) {
            this.events().article({
                blog_schema: 'blog',
                article_schema: 'article',
                author_schema: 'author',
                type: 'article_comment',
            });
        }
        
    }

    if (pageType == 'author') {

        this.events().author({
            author_schema: 'author',
            type: 'author_view',
        });
        
    }

    //############################//
    // || CLICK EVENT TRIGGERS || //
    //############################//

    document.querySelectorAll('[x-hb-promo-click]').forEach(elm => {

        elm.addEventListener('click', event => { 

            event.preventDefault();
            
            let index  = elm.closest('.swiper-slide').getAttribute('data-swiper-slide-index');
            
            this.events().promotionClick({
                promo_id: elm.getAttribute('x-hb-promo-id'),
                promo_name: elm.getAttribute('x-hb-promo-name'),
                promo_type: 'carousel',
                promo_position: parseInt(index) + 1,
                creative_id: 'homepage-hero',
            });

            // Give snowplow 500ms to fire event before navigating to link

            setTimeout(() => {
                window.location.href = elm.getAttribute('href');
            }, 500);

        });

    });

    document.querySelectorAll('[x-hb-product-click]').forEach(elm => {

        elm.addEventListener('click', event => { 

            event.preventDefault();
            
            let index = [...elm.parentElement.children].indexOf(elm);

            this.events().productClick({
                product_id: elm.getAttribute('x-hb-product-id'),
                product_name: elm.getAttribute('x-hb-product-name'),
                product_type: elm.getAttribute('x-hb-product-type'),
                product_price: parseInt(elm.getAttribute('x-hb-product-price')) / 100,
                product_currency: 'GBP',
                product_position: index + 1,
                product_creative: 'more_info',
                list_name: "recommended"
            });

            // Give snowplow 500ms to fire event before navigating to link
            
            setTimeout(() => {
                window.location.href = elm.getAttribute('x-href');
            }, 500);

        });

    });

    window.addBlogClickListener = () => {

        document.querySelectorAll('[x-hb-article-click]').forEach(elm => {

            if (elm.getAttribute('hb-click-listener')) {
                return;
            }

            elm.setAttribute('hb-click-listener', 1);

            elm.addEventListener('click', event => { 

                event.preventDefault();

                this.events().article({
                    blog_schema: 'blog',
                    article_schema: elm.getAttribute('x-hb-schema'),
                    type: 'article_click',
                    name: elm.getAttribute('x-hb-article-click'),
                });

                // Give snowplow 500ms to fire event before navigating to link
                setTimeout(() => {
                    window.location.href = elm.getAttribute('href');
                }, 500);

            });

        });

    }

    window.addEventListener('blog_search_loaded', event => {

        window.addBlogClickListener();
        this.schemalayer();

    });

    window.addBlogClickListener();

}