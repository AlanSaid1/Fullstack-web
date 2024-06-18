"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from './components/navbar/Navbar';
import Questions from './components/questions/questions';
import Footer from './components/footer/Footer';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        console.log('Sending token:', token);
        const res = await axios.get('http://localhost:8080/api/go/protected', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setIsAuthenticated(true);
          console.log('Authenticated');
        } else {
          throw new Error('Not authorized');
        }
      } catch (err) {
        console.log('Error during authentication:', err);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <body>
      <Navbar />
      <div>
        <h1>Bienvenido de vuelta!</h1>
        <Questions />
        <Footer />
      </div>
    </body>
  );
}
