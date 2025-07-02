import React, { useEffect, useState } from 'react';

import { CookieConsentLevel, hasRequiredLevel } from './onetrust-constants';
import { useScript } from '../../../hooks/useScript';

interface HeapLoaderProps {
  heapProjectId?: string;
  currentConsents: string;
}

const useLocation = () => {
  const [location, setLocation] = useState({ pathname: '', search: '' });

  useEffect(() => {
    // Function to update pathname
    const handleLocationChange = () => {
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
      });
    };

    // Set initial pathname
    handleLocationChange();

    // Subscribe to changes
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);

    // Clean up function
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  return location;
};

const scriptAttributes = (heapProjectId?: string) => ({
  type: 'text/javascript',
  id: 'load-heap',
  text: `
    window.heapReadyCb=window.heapReadyCb||[],window.heap=window.heap||[],heap.load=function(e,t){window.heap.envId=e,window.heap.clientConfig=t=t||{},window.heap.clientConfig.shouldFetchServerConfig=!1;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://cdn.us.heap-api.com/config/"+e+"/heap_config.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r);var n=["init","startTracking","stopTracking","track","resetIdentity","identify","getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties","removeEventProperty","clearEventProperties","addAccountProperties","addAdapter","addTransformer","addTransformerFn","onReady","addPageviewProperties","removePageviewProperty","clearPageviewProperties","trackPageview"],i=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);window.heapReadyCb.push({name:e,fn:function(){heap[e]&&heap[e].apply(heap,t)}})}};for(var p=0;p<n.length;p++)heap[n[p]]=i(n[p])};
    heap.load("${heapProjectId}");
    `,
});

const useHeapLoader = ({ heapProjectId, currentConsents }: HeapLoaderProps) => {
  const hasConsent = hasRequiredLevel(
    currentConsents,
    CookieConsentLevel.Necessary
  );
  useScript(
    'head',
    scriptAttributes(heapProjectId),
    hasConsent && (heapProjectId ? true : false)
  );
};

export const HeapLoader: React.FC<HeapLoaderProps> = ({
  heapProjectId,
  currentConsents,
}) => {
  useHeapLoader({ heapProjectId, currentConsents });

  const { pathname, search } = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.heap) {
      window.heap.track('auth4genai:page-view', {
        title: document.title,
        url: pathname + search,
      });
    }
  }, [pathname, search]);

  return null;
};
