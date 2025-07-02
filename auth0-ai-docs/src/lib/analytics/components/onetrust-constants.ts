export const COOKIE_CONSENT_STATUS = {
  WAITING_FOR_CONSENT: 'waitingForConsent',
  EXPRESSED_CONSENT: 'expressedConsent',
};

export enum CookieConsentLevel {
  Necessary = '1',
  Performance = '2',
  Functional = '3',
  Advertising = '4',
}

export const hasRequiredLevel = (
  consentLevels: string,
  requiredLevel: CookieConsentLevel
) => {
  return consentLevels?.includes(requiredLevel) || false;
};
