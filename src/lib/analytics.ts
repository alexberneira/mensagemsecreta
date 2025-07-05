// Google Analytics Configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Custom events for Inbox Secreta
export const trackUserRegistration = () => {
  event({
    action: 'user_registration',
    category: 'engagement',
    label: 'new_user_signup',
  })
}

export const trackMessageSent = () => {
  event({
    action: 'message_sent',
    category: 'engagement',
    label: 'anonymous_message',
  })
}

export const trackCardGenerated = () => {
  event({
    action: 'card_generated',
    category: 'engagement',
    label: 'instagram_card',
  })
}

export const trackCardShared = () => {
  event({
    action: 'card_shared',
    category: 'engagement',
    label: 'social_share',
  })
}

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
} 