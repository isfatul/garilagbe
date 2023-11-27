import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session } = useSession();

  return <div>Admin Dashboard</div>;
}

AdminDashboard.auth = {
  required: true,
  role: "admin",
  loading: <div>Loading...</div>,
  redirect: "/sys-admin/login",
};
