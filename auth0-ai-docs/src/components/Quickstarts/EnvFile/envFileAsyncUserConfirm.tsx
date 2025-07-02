import copy from 'copy-text-to-clipboard';
import React, { use, useEffect, useMemo, useState } from 'react';

import { useSession } from '@site/src/hooks/useSession';

import CodeBlockWithStore, { Variables } from '../../CodeBlockWithStore';
import { useQuickstartClientContext } from '../QuickstartClientContextProvider';

export default function envFileAsyncUserConfirm() {
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

  const envFileContent = `AUTH0_DOMAIN='<your-auth0-domain>'
AUTH0_CLIENT_ID='<your-auth0-application-client-id>'
AUTH0_CLIENT_SECRET='${clientSecretReplaceVarContent}'

# You can use any provider of your choice supported by Vercel AI
OPENAI_API_KEY="YOUR_API_KEY"

# API
STOCK_API_URL=<your-stock-api-url>
AUDIENCE=sample-stock-api
`;

  return (
    <CodeBlockWithStore
      isLoggedIn={isLoggedIn}
      language="bash"
      title=".env"
      showLineNumbers={true}
      variables={variables}
      onCopyClick={onCopyClick}
    >
      {envFileContent}
    </CodeBlockWithStore>
  );
}
