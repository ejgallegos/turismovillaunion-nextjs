'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import React from 'react';

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaKey) {
    // This allows development without setting up reCAPTCHA keys.
    console.warn('reCAPTCHA V3 site key not found. reCAPTCHA will be disabled.');
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
