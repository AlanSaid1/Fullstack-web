"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
    <div>
      <h1>Welcome to the Home Page</h1>
    </div>
  );
}
