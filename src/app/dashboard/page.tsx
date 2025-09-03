import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/google/route';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  return (
    <div className="p-4">
      <h1>Welcome, {session?.user?.name || 'User'}!</h1>
      <p>Email: {session?.user?.email || 'xxx@xxx.com'}</p>
    </div>
  );
}