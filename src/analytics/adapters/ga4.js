/**
 * GA4 Adapter — stub ready for activation
 *
 * To activate:
 * 1. Add to index.html before </head>:
 *    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
 *    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');</script>
 *
 * 2. In analytics/index.js, uncomment: registerAdapter(ga4Adapter)
 */
export const ga4Adapter = {
  track({ event, timestamp: _timestamp, url: _url, ...properties }) {
    if (typeof window.gtag !== 'function') return
    window.gtag('event', event, properties)
  },

  page({ path }) {
    if (typeof window.gtag !== 'function') return
    window.gtag('event', 'page_view', { page_path: path })
  },
}
