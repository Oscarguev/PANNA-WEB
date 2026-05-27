// Event name constants — use these to avoid magic strings across the codebase
export const EVENTS = {
  // ─── Commerce ──────────────────────────────────────────────────────────────
  ADD_TO_CART:        'add_to_cart',
  REMOVE_FROM_CART:   'remove_from_cart',
  CHECKOUT_START:     'checkout_start',
  CHECKOUT_COMPLETE:  'checkout_complete',
  PREORDER_SELECT:    'preorder_select',
  WALLET_TOPUP:       'wallet_topup',

  // ─── Restaurant ────────────────────────────────────────────────────────────
  RESERVATION_SUBMIT:  'reservation_submit',
  RESERVATION_CONFIRM: 'reservation_confirm',
  EVENT_TICKET_BUY:    'event_ticket_buy',

  // ─── Engagement ────────────────────────────────────────────────────────────
  MARKET_VIEW:       'market_view',
  MENU_VIEW:         'menu_view',
  REVIEW_PUBLISH:    'review_publish',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  LOYALTY_OPEN:      'loyalty_open',

  // ─── UX ────────────────────────────────────────────────────────────────────
  DRAWER_OPEN:    'drawer_open',
  CTA_CLICK:      'cta_click',
  PAGE_VIEW:      'page_view',
  INSTALL_PROMPT: 'install_prompt',
}
