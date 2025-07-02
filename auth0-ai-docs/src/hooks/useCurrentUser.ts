import { useState, useMemo, useEffect } from 'react';
import { useSession } from '@site/src/hooks/useSession';

interface User {
  name: string;
  email: string;
  initials: string;
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { data } = useSession();
  const sessionUser = useMemo(() => data?.user, [data]);

  useEffect(() => {
    if (sessionUser) {
      setCurrentUser({
        name: sessionUser.name,
        email: sessionUser.email,
        initials: sessionUser.name
          .split(' ')
          .map((n) => n.charAt(0).toUpperCase())
          .join(''),
      });
    } else if (currentUser && !sessionUser) {
      setCurrentUser(null);
    }
  }, [sessionUser]);

  return { currentUser };
}
