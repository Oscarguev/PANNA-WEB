import { dispatch, dispatchPage, dispatchIdentify, registerAdapter } from './dispatcher'
import { consoleAdapter } from './adapters/console'
// import { ga4Adapter }     from './adapters/ga4'       // uncomment to activate GA4
// import { posthogAdapter } from './adapters/posthog'   // uncomment to activate PostHog

// ─── Adapter registration ────────────────────────────────────────────────────
// consoleAdapter is always active in DEV, zero-cost in production
registerAdapter(consoleAdapter)
// registerAdapter(ga4Adapter)
// registerAdapter(posthogAdapter)

// ─── Public API ──────────────────────────────────────────────────────────────

/** Fire a named event with optional properties */
export const track = (eventName, properties = {}) => {
  dispatch(eventName, properties)
}

/** Fire a page view */
export const page = (path, properties = {}) => {
  dispatchPage(path, properties)
}

/** Associate subsequent events with a known user */
export const identify = (userId, traits = {}) => {
  dispatchIdentify(userId, traits)
}

export { EVENTS } from './events'
