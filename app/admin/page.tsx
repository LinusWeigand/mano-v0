import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboard from './dashboard';
import { getBaseUrl } from '@/lib/utils';


async function checkAdmin() {
  console.log("CheckAdmin")

  console.log("Base URL: ", getBaseUrl())
  const url = new URL('/api/auth/admin', getBaseUrl());
  console.log("URL: ", url)
  const res = await fetch(url, {
    headers: {
      Cookie: cookies().toString(), // secure cookie forwarding
    },
    cache: 'no-store', // don't cache admin auth checks
  });


  console.log("res: ", res)

  if (!res.ok) {
    redirect('/login');
  }

  const authData = await res.json();

  if (!authData.is_admin) {
    redirect('/');
  }

  return authData;
}

export default async function AdminPage() {
  await checkAdmin();

  return <AdminDashboard />;
}
