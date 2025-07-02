import useSWR from 'swr';

import { SessionData } from '@auth0/nextjs-auth0/types';

export const SESSION_PATH = '/ai/api/session';
export const LOGGED_OUT_STATE = {
  data: null,
  isLoading: false,
} as ClientSessionData;

export type Session = {
  user: {
    given_name: SessionData['user']['given_name'];
    family_name: SessionData['user']['family_name'];
    email: SessionData['user']['email'];
    email_verified: SessionData['user']['email_verified'];
    org_id: SessionData['user']['org_id'];
    sub: SessionData['user']['sub'];
    name: SessionData['user']['name'];
    nickname: SessionData['user']['nickname'];
    picture: SessionData['user']['picture'];
  };
  tenant: string;
  domain: string;
  tenant_domains: string[] | undefined;
  scopes: string;
};

export type ClientSessionData = {
  data: Session | null;
  isLoading: boolean;
  error?: Error;
};

// Extend the Error type to include the 'info' property
interface ExtendedError extends Error {
  info?: unknown;
  status?: number;
}

export function useSession(): ClientSessionData {
  const { data, error, isLoading } = useSWR<
    ClientSessionData['data'],
    Error,
    string
  >(SESSION_PATH, async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      // Handle 401 as a valid "null session" response
      if (res.status === 401) {
        return null;
      }

      // For other errors, attach extra info to the error object
      const errorResponse = await res.json();
      const errorObj: ExtendedError = new Error('Error getting session.');
      errorObj.info = errorResponse;
      errorObj.status = res.status;
      throw errorObj;
    }

    return res.json();
  });

  // if we have the user loaded via the provider, return it
  if (data) {
    return {
      data: data as ClientSessionData['data'],
      isLoading: false,
      error: undefined,
    };
  }

  if (error) {
    return {
      data: null,
      isLoading: false,
      error,
    };
  }

  return {
    data: data as ClientSessionData['data'],
    isLoading,
    error,
  };
}
