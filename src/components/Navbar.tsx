// Navbar principal do Inbox Secreta
// Exibe links de navegação e login/logout
'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="w-full flex items-center justify-between p-4 bg-white shadow">
      <Link href="/" className="font-bold text-lg">Inbox Secreta</Link>
      <div className="flex gap-4 items-center">
        {!user && <><Link href="/login">Login</Link><Link href="/register">Cadastro</Link></>}
        <Link href="/dashboard">Dashboard</Link>
        {user && (
          <>
            <span className="text-sm text-gray-600">{user.email}</span>
            <button onClick={signOut} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">Sair</button>
          </>
        )}
      </div>
    </nav>
  );
} 