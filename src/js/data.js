export let consent = {
    required: true,
    functional: true,
    analytics: true,
    social: true,
    targeting: true
}

export let customer = {
    email: "example@vafo.digital",
    id: "example_id",
    status: "logged_in", // logged_in or guest
    orders_count: 23,
    last_order_date: '2025-03-30',
    active_subs:  1,
    total_subs: 3,
    subscriber_status: "active", // active or inactive
    loyalty_segment: "Loyal",
    total_pets: 2
}

export let product = {
    id: "example-product-url",
    quantity: 4,
    category: "category example",
    name: "Example product title",
    price: 10,
    currency: "GBP",
    variant: "variant_id"
}

export let cart = {
    cart_id: "example_cart_id",
    total_value: 100,
    currency: "GBP",
}

export let promoClick = {
    id: "promo_click_id",
    name: "Promo Click Name",
    type: "promo_click_type",
    position: 1,
    creative_id: "promo_click_creative_id",
}

export let subscription = {
    id: 1234567890,
    name: "Name",
    product_id: "product_id",
    status: "Enabled",
    sku: "subsku",
    quantity: 3,
    price: 30,
    frequency: 20,
    frequency_unit: "days",
    next_date: "2025-05-31",
    customer_id: 1234567890,
    address_id: 1234567890,
    payment_id: 1234567890,
    payment_type: "payment_type",
    discount: "discount",
    last_order_id: "last_order_id",
    total_orders: 12,
    created_at: "2025-01-17",
    cancelled_at: "",
    cancelled_reason: "",
    cancelled_comments: ""
}

export let transaction = {
    id: "transaction_id",
    affiliation: "affiliation",
    revenue: 100,
    shipping: 6,
    tax: 20,
    currency: "GBP",
    discount_code: "DISCOUNT_124",
    discount_amount: 10,
    total_quantity: 10,
    payment_method: "visa"
}

export let blog = {
    id: "blog_page",
    name: "Blog Page"
}

export let article = {
    id: "article_id",
    name: "Article Name",
    author: "Author",
    blog: "Blog name",
    tags: "tag1, tag2",
    updated: "date"
}

export let author = {
    id: "author_id",
    name: "Joe Bloggs"
}

export let form = {
    id: "form_id",
    name: "Form Name",
    content: "Form content example"
    // plus any fields from the form
    // e.g. name, email, phone, address, etc
    // or any other custom fields
}