'use client';
import AddVehicleForm from '@/components/admin/ui/AddVehicleForm';
import AuthorizeProtect from '@/lib/hooks/AuthorizeProtect';
const page = () => {
  return (
    <AuthorizeProtect module="car" action="create">
      <AddVehicleForm />
    </AuthorizeProtect>
  );
};
export default page;

