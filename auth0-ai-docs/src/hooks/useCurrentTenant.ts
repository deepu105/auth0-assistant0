import { useState, useMemo, useEffect } from 'react';
import { useSession } from '@site/src/hooks/useSession';

interface Tenant {
  name: string;
  tier: string;
  locality: string;
}

const getTenantName = (tenant: string): string => {
  // tenant will have shape https://<tenant>.<env>.auth0.com
  try {
    const url = new URL(tenant);
    return url.hostname.split('.')[0];
  } catch (e) {
    console.error('Unexpected tenant provided:', tenant);
    return tenant;
  }
};

const getTenantLocality = (tenant: string): string => {
  // tenant will have shape https://<tenant>.<env>.auth0.com
  try {
    const url = new URL(tenant);
    return url.hostname.split('.')[1];
  } catch (e) {
    console.error('Unexpected tenant provided:', tenant);
    return tenant;
  }
};

export function useCurrentTenant() {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const { data } = useSession();
  const sessionTenant = useMemo(() => data?.tenant, [data]);

  useEffect(() => {
    if (sessionTenant) {
      setCurrentTenant({
        name: getTenantName(sessionTenant),
        tier: 'Development', // Fixed label for AI Developer tenants
        locality: getTenantLocality(sessionTenant),
      });
    } else if (currentTenant && !sessionTenant) {
      setCurrentTenant(null);
    }
  }, [sessionTenant]);

  return { currentTenant };
}
