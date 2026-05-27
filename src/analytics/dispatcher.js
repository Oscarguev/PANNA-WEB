const adapters = []

export function registerAdapter(adapter) {
  adapters.push(adapter)
}

function buildPayload(eventName, properties) {
  return {
    event: eventName,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.pathname : '',
    ...properties,
  }
}

export function dispatch(eventName, properties = {}) {
  const payload = buildPayload(eventName, properties)
  adapters.forEach((adapter) => {
    try {
      adapter.track(payload)
    } catch (_) {
      // analytics must never break the app
    }
  })
}

export function dispatchPage(path, properties = {}) {
  const payload = buildPayload('page_view', { path, ...properties })
  adapters.forEach((adapter) => {
    try {
      const fn = adapter.page ?? adapter.track
      fn.call(adapter, payload)
    } catch (_) {
      // silent
    }
  })
}

export function dispatchIdentify(userId, traits = {}) {
  adapters.forEach((adapter) => {
    try {
      adapter.identify?.(userId, traits)
    } catch (_) {
      // silent
    }
  })
}
