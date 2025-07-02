import { Client } from 'auth0';
import React, { useMemo, useState } from 'react';

export interface IQuickstartClientContext {
  quickstartClient: {
    data: Client | undefined;
  };
  setQuickstartClient: (state: { data: Client | undefined }) => void;
}

export const QuickstartClientContext =
  React.createContext<IQuickstartClientContext>({
    quickstartClient: {
      data: undefined,
    },
    setQuickstartClient: (state: { data: Client | undefined }) => {},
  });

export const QuickstartClientContextProvider = ({ children }: { children }) => {
  const [quickstartClient, setQuickstartClient] = useState<{
    data: Client | undefined;
  }>({
    data: undefined,
  });

  const value = useMemo(
    () => ({
      quickstartClient,
      setQuickstartClient,
    }),
    [quickstartClient, setQuickstartClient]
  );

  return (
    <QuickstartClientContext.Provider value={value}>
      {children}
    </QuickstartClientContext.Provider>
  );
};

export const useQuickstartClientContext = () =>
  React.useContext(QuickstartClientContext);
