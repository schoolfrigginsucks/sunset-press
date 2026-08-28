// Sunset Press — Meta Purchase tracking
// Paste into: Shopify admin -> Settings -> Customer events -> Add custom pixel
//
// Your site pixel already reports PageView, ViewContent, AddToCart and
// InitiateCheckout. Purchase happens on Shopify's checkout, which the site
// never sees, so it has to be reported from here. Without it Meta knows who
// started checkout but never who actually paid, and cannot optimise for buyers.

!(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = '2.0';
  n.queue = [];
  t = b.createElement(e);
  t.async = !0;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '1531708584919000');

analytics.subscribe('checkout_completed', (event) => {
  const checkout = event.data.checkout;
  const items = checkout.lineItems || [];

  fbq('track', 'Purchase', {
    value: checkout.totalPrice?.amount,
    currency: checkout.currencyCode,
    content_type: 'product',
    content_ids: items.map((i) => i.variant?.id).filter(Boolean),
    contents: items.map((i) => ({ id: i.variant?.id, quantity: i.quantity })),
    num_items: items.reduce((n, i) => n + (i.quantity || 0), 0),
    order_id: checkout.order?.id,
  });
});
