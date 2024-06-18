"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

interface Bond {
  id: number;
  name: string;
  number: number;
  price: number;
  currency: string;
  buyer_id: number | null;
}

const UserBonds: React.FC = () => {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBonds = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/go/bonds/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBonds(response.data);
      } catch (err) {
        setError('Failed to fetch bonds');
      } finally {
        setLoading(false);
      }
    };

    fetchBonds();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 mt-24">
        <h1 className="text-2xl font-bold mb-4">My Bonds</h1>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Number</th>
              <th className="py-2">Price</th>
              <th className="py-2">Currency</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {bonds.map((bond) => (
              <tr key={bond.id}>
                <td className="py-2">{bond.id}</td>
                <td className="py-2">{bond.name}</td>
                <td className="py-2">{bond.number}</td>
                <td className="py-2">{bond.price}</td>
                <td className="py-2">{bond.currency}</td>
                <td className="py-2">{bond.buyer_id ? 'Bought' : 'Available'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
};

export default UserBonds;
