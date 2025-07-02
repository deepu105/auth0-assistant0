import * as React from 'react';

import { COOKIE_CONSENT_STATUS } from './onetrust-constants';
import { HeapLoader } from './heap-script';
import { useCallback, useEffect } from 'react';
import { saveUTM } from '../utils/save-utm';

interface AnalyticsScriptLoaderProps {
  heapProjectId?: string;
}

/**
 * AnalyticsScriptLoader is used to load any scripts containing cookies which require user consent before they can be set
 * This way we block the use of the cookies until the user has given consent
 */
export const AnalyticsScriptLoader: React.FC<AnalyticsScriptLoaderProps> = ({
  heapProjectId,
}) => {
  const [currentConsents, setCurrentConsents] = React.useState('');

  const handleConsentChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      if (
        e.data === COOKIE_CONSENT_STATUS.EXPRESSED_CONSENT &&
        window.OnetrustActiveGroups !== currentConsents
      ) {
        setCurrentConsents(window.OnetrustActiveGroups);
      }

      if (e.data === COOKIE_CONSENT_STATUS.WAITING_FOR_CONSENT) {
        window.OneTrust.OnConsentChanged(() =>
          setCurrentConsents(window.OnetrustActiveGroups)
        );
      }
    },
    [currentConsents]
  );

  // Set initial consents on mount
  useEffect(() => {
    setCurrentConsents(window.OnetrustActiveGroups ?? '');
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleConsentChange, false);
    saveUTM();

    return () => window.removeEventListener('message', handleConsentChange);
  }, [handleConsentChange]);

  return (
    <>
      {heapProjectId && (
        <HeapLoader
          currentConsents={currentConsents}
          heapProjectId={heapProjectId}
        />
      )}
    </>
  );
};
