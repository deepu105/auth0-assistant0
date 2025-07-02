import { mutate } from 'swr';
import { LOGGED_OUT_STATE, SESSION_PATH } from '../../hooks/useSession';

export const getCsrfToken = async () => {
  const response = await fetch('/ai/csrf-token', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch CSRF token');
  }

  const { csrfToken } = await response.json();
  if (!csrfToken) {
    throw new Error('CSRF token not found');
  }

  return csrfToken;
};

export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let csrfToken: string;
  if (options.method && options.method !== 'GET') {
    csrfToken = await getCsrfToken();
  }

  const headers = {
    ...(options.headers || {}),
    'X-CSRF-Token': csrfToken,
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  })
    .then(async (response) => {
      if (!response.ok) {
        const res = await response.json();

        if (res.error === 'not_authenticated') {
          mutate(SESSION_PATH, LOGGED_OUT_STATE);
        }
      }
      return response;
    })
    .catch((error) => {
      console.error('Error in API request was:', error);
      throw error;
    });
};
