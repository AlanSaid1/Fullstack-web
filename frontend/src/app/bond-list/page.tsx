"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Bond {
  id: number;
  name: string;
  number: number;
  price: number;
  currency: string;
  seller_id: number;
  buyer_id: number | null;
}

const BondList: React.FC = () => {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBonds = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/go/bonds');
        setBonds(res.data);
      } catch (err) {
        setError('Failed to fetch bonds');
      } finally {
        setLoading(false);
      }
    };

    fetchBonds();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Bonds</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Number</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Currency</th>
            <th className="py-2 px-4 border-b">Seller ID</th>
          </tr>
        </thead>
        <tbody>
          {bonds.map(bond => (
            <tr key={bond.id}>
              <td className="py-2 px-4 border-b">{bond.id}</td>
              <td className="py-2 px-4 border-b">{bond.name}</td>
              <td className="py-2 px-4 border-b">{bond.number}</td>
              <td className="py-2 px-4 border-b">{bond.price}</td>
              <td className="py-2 px-4 border-b">{bond.currency}</td>
              <td className="py-2 px-4 border-b">{bond.seller_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BondList;
