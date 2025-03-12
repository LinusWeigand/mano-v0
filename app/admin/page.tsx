import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboard from './dashboard';

async function checkAdmin() {
  const res = await fetch('http://localhost/api/auth/status', {
    headers: {
      Cookie: cookies().toString(), // secure cookie forwarding
    },
    cache: 'no-store', // don't cache admin auth checks
  });

  if (!res.ok) {
    redirect('/login');
  }

  const authData = await res.json();

  console.log("authData: ", authData)

  if (!authData.is_admin) {
    // redirect('/');
  }

  return authData;
}

export default async function AdminPage() {
  await checkAdmin();

  return <AdminDashboard />;
}
