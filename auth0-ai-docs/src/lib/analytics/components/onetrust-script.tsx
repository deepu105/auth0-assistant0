import React from 'react';
import { COOKIE_CONSENT_STATUS } from './onetrust-constants';
import { useScript } from '../../../hooks/useScript';

interface OneTrustScriptProps {
  id: string;
}

const scriptAttributes = (id: string) => ({
  src: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
  type: 'text/javascript',
  charset: 'utf-8',
  id: 'cookie-consent-script',
  'data-domain-script': id,
});

const consentWrapperAttributes = {
  id: 'consent-wrapper',
  type: 'text/javascript',
  text: `
      function OptanonWrapper() {
        const consentStatus = document.getElementById("onetrust-accept-btn-handler") ? '${COOKIE_CONSENT_STATUS.WAITING_FOR_CONSENT}' : '${COOKIE_CONSENT_STATUS.EXPRESSED_CONSENT}';
        window.top.postMessage(consentStatus, '*');
      }
    `,
};

const useOneTrustLoader = ({ id }: OneTrustScriptProps) => {
  useScript('head', scriptAttributes(id), id?.length > 0);
};

const useConsentWrapper = () => {
  useScript('head', consentWrapperAttributes);
};

export const OnetrustScript: React.FC<OneTrustScriptProps> = ({ id }) => {
  useOneTrustLoader({ id });
  useConsentWrapper();

  return null;
};
