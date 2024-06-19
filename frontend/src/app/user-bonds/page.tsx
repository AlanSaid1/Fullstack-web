"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import { useRouter } from 'next/navigation';

interface Bond {
  id: number;
  name: string;
  number: number;
  price: number;
  currency: string;
  seller_id: number;
  buyer_id: number | null;
}

const UserBonds: React.FC = () => {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserBonds = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/go/bonds/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBonds(res.data);
      } catch (err) {
        setError('Failed to fetch bonds');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBonds();
  }, []);

  const handleCreateBond = () => {
    router.push('/create-bond');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 mt-24"> {/* Added mt-24 for top margin */}
        <h1 className="text-2xl font-bold mb-4">Your Bonds</h1>
        <button
          onClick={handleCreateBond}
          className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Bond
        </button>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Number</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Currency</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {bonds.map((bond) => (
              <tr key={bond.id}>
                <td className="py-2 px-4 border-b">{bond.id}</td>
                <td className="py-2 px-4 border-b">{bond.name}</td>
                <td className="py-2 px-4 border-b">{bond.number}</td>
                <td className="py-2 px-4 border-b">{bond.price}</td>
                <td className="py-2 px-4 border-b">{bond.currency}</td>
                <td className="py-2 px-4 border-b">{bond.buyer_id ? 'Bought' : 'Available'}</td>
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
