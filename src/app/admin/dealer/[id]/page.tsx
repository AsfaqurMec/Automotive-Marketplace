// 'use client';

// import React, { Suspense } from 'react';

// interface PageParams {
//     id: string;
// }

// const DealerProfile = React.lazy(() => import('@/components/admin/ui/DealerProfile'));

// export default function Page({ params }: { params: PageParams }) {
//   const { id } = params;
//   return (
//     <Suspense fallback={<div>Loading dealer profile...</div>}>
//       <DealerProfile dealerId={id} />
//     </Suspense>
//   );
// }
'use client';

import React, { Suspense, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import useAuth from '@/lib/hooks/useAuth';

const DealerProfile = React.lazy(() => import('@/components/admin/ui/DealerProfile'));
const ALLOWED_ROLES = new Set(['admin', 'superAdmin', 'dealer']);

export default function Page() {
  const params = useParams<{ id: string | string[] }>();
  const dealerId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? null;

  const router = useRouter();
  const { user, isGettingLoggedIn } = useAuth();
  const isAuthorized = user?.role?.roleId ? ALLOWED_ROLES.has(user.role.roleId) : false;

  useEffect(() => {
    if (!isGettingLoggedIn && (!user || !isAuthorized)) {
      router.replace('/');
    }
  }, [isAuthorized, isGettingLoggedIn, router, user]);

  if (!dealerId) {
    return null;
  }

  if (!isGettingLoggedIn && (!user || !isAuthorized)) {
    return null;
  }

  return (
    <Suspense fallback={<div>Loading dealer profile...</div>}>
      <DealerProfile dealerId={dealerId} />
    </Suspense>
  );
}
