const DEV = import.meta.env.DEV

// Styled dev-only logger — zero output in production builds
export const consoleAdapter = {
  track({ event, timestamp, ...props }) {
    if (!DEV) return
    const hasProps = Object.keys(props).length > 0
    console.groupCollapsed(
      `%c[Analytics] %c${event}`,
      'color:#888; font-size:11px',
      'color:#c5a880; font-weight:bold; font-size:11px'
    )
    console.log('%ctimestamp', 'color:#555', timestamp)
    if (hasProps) console.table(props)
    console.groupEnd()
  },

  page({ path, timestamp }) {
    if (!DEV) return
    console.log(
      `%c[Analytics] %cpage_view %c${path}`,
      'color:#888; font-size:11px',
      'color:#c5a880; font-weight:bold; font-size:11px',
      'color:#f5f5f3; font-size:11px'
    )
  },

  identify(userId, traits) {
    if (!DEV) return
    console.log('%c[Analytics] identify', 'color:#c5a880; font-weight:bold', userId, traits)
  },
}
