// frontend/app/layout.tsx
import '../styles/globals.css';
import Navbar from '@/app/components/navbar/Navbar';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
