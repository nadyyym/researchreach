import posthog from 'posthog-js';

let initialized = false;

export function initPostHog() {
  if (initialized || typeof window === 'undefined') return;
  const key = import.meta.env.PUBLIC_POSTHOG_KEY;
  const host = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
  if (!key) return;
  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
  });
  initialized = true;
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  posthog.capture(event, properties);
}
