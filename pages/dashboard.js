import { signOut } from "next-auth/react";

export default function dashboard() {
  async function handleLogout() {
    signOut();
  }
  return (
    <div>
      <div>Dashboard</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

dashboard.auth = true;
