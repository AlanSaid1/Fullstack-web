// frontend/app/layout.tsx
import '../styles/globals.css';
import Navbar from '@/app/components/navbar/Navbar';

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
