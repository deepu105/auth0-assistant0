import copy from 'copy-text-to-clipboard';
import React, { useEffect, useMemo, useState } from 'react';

import { useSession } from '@site/src/hooks/useSession';

import CodeBlockWithStore, { Variables } from '../../CodeBlockWithStore';
import { useQuickstartClientContext } from '../QuickstartClientContextProvider';

export default function envFileUserAuth() {
  const { data: session } = useSession();

  const { quickstartClient } = useQuickstartClientContext();

  const isLoggedIn = useMemo(() => !!session, [session]);

  const clientSecretReplaceVarContent = useMemo(
    () =>
      quickstartClient?.data?.client_secret
        ? '<masked>'
        : '<your-auth0-application-client-secret>',
    [quickstartClient?.data?.client_secret]
  );

  const tenantDomain = useMemo(() => session?.domain ?? '', [session]);

  const variables = useMemo(() => {
    let vars: Variables[] = [];
    if (tenantDomain) {
      vars.push({
        searchString: '<your-auth0-domain>',
        replaceValue: tenantDomain,
      });
    }
    if (quickstartClient?.data?.client_id) {
      vars.push({
        searchString: '<your-auth0-application-client-id>',
        replaceValue: quickstartClient?.data?.client_id,
      });
    }
    return vars;
  }, [tenantDomain, quickstartClient?.data]);

  const onCopyClick = (value: string) => {
    if (quickstartClient?.data?.client_secret) {
      const replacedMasked = value.replace(
        clientSecretReplaceVarContent,
        quickstartClient?.data?.client_secret
      );
      copy(replacedMasked);
    } else {
      copy(value);
    }
  };

  const envFileContent = `AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
APP_BASE_URL='http://localhost:3000'
AUTH0_DOMAIN='<your-auth0-domain>'
AUTH0_CLIENT_ID='<your-auth0-application-client-id>'
AUTH0_CLIENT_SECRET='${clientSecretReplaceVarContent}'
`;

  return (
    <CodeBlockWithStore
      isLoggedIn={isLoggedIn}
      language="bash"
      title=".env.local"
      showLineNumbers={true}
      variables={variables}
      onCopyClick={onCopyClick}
    >
      {envFileContent}
    </CodeBlockWithStore>
  );
}
