'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function RootPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
    } else if (session.user.role === 'ADMIN') {
      router.push('/admin');
    } else if (session.user.role === 'BIDAN') {
      router.push('/midwife');
    } else if (session.user.role === 'PASIEN') {
      router.push('/patient');
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🏥 Sistem Informasi Klinik Bersalin
        </h1>
        <p className="text-gray-600 mb-8">Loading...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
      </div>
    </div>
  );
}
