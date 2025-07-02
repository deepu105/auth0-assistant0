import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { isAbsoluteUrl } from '../utils/is-absolute-url';
import { OnetrustScript } from '../lib/analytics/components/onetrust-script';
import { AnalyticsScriptLoader } from '../lib/analytics/components/analytics-script-loader';
import { GTMScript } from '../lib/analytics/components/gtm-script';

declare global {
  interface Window {
    heap?: {
      track: (event: string, properties: Record<string, unknown>) => void;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OneTrust: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OnetrustActiveGroups: any;
  }
}

function setReturnTo(pathname: string) {
  const tenMinutes = new Date(new Date().getTime() + 10 * 60 * 1000);
  Cookies.set('auth0_gen-ai-webapp_return_to', pathname, {
    expires: tenMinutes,
    sameSite: 'lax',
    path: '/ai',
  });
}

export default function Root({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const location = useLocation();
  const { heapProjectId, heapEnabled, oneTrustDataDomainId } =
    useDocusaurusContext().siteConfig.customFields;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.heap) {
      window.heap.track('auth4genai:page-view', {
        title: document.title,
        url: location.pathname + location.search,
      });
    }
  }, [location]);

  if (!isAbsoluteUrl(location.pathname)) {
    setReturnTo(location.pathname);
  }

  return (
    <>
      <OnetrustScript id={oneTrustDataDomainId as string} />
      <AnalyticsScriptLoader
        heapProjectId={heapProjectId as string}
        heapEnabled={heapEnabled as boolean}
      />
      <GTMScript />
      {children}
    </>
  );
}
