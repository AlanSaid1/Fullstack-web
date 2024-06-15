// frontend/components/Navbar.tsx
import Link from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">BondsApp</h1>
        <div>
          <Link href="/bonds" className="mr-4">My Bonds</Link>
          <Link href="/create-bond" className="mr-4">Create Bond</Link>
          <Link href="/register" className="mr-4">Register</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
