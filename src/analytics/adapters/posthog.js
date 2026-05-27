/**
 * PostHog Adapter — stub ready for activation
 *
 * To activate:
 * 1. npm install posthog-js
 * 2. Call posthog.init('phc_XXXXXXXX', { api_host: 'https://app.posthog.com' }) once at app start
 * 3. In analytics/index.js, uncomment: registerAdapter(posthogAdapter)
 */
export const posthogAdapter = {
  track({ event, timestamp, url, ...properties }) {
    if (typeof window.posthog?.capture !== 'function') return
    window.posthog.capture(event, properties)
  },

  page({ path }) {
    if (typeof window.posthog?.capture !== 'function') return
    window.posthog.capture('$pageview', { $current_url: window.location.href })
  },

  identify(userId, traits) {
    if (typeof window.posthog?.identify !== 'function') return
    window.posthog.identify(userId, traits)
  },
}
