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

import React, { Suspense } from 'react';

const DealerProfile = React.lazy(() => import('@/components/admin/ui/DealerProfile'));

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // ✅ unwrap params with React.use()

  return (
    <Suspense fallback={<div>Loading dealer profile...</div>}>
      <DealerProfile dealerId={id} />
    </Suspense>
  );
}
