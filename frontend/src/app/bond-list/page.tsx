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
  seller_id: number;
  buyer_id: number | null;
}

const BondList: React.FC = () => {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [currency, setCurrency] = useState<string>('MXN');

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

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/go/exchange-rate');
        setExchangeRate(res.data.exchange_rate);
      } catch (err) {
        console.error('Failed to fetch exchange rate');
      }
    };

    fetchExchangeRate();
  }, []);

  const convertPrice = (price: number, bondCurrency: string): number => {
    if (currency === 'USD' && bondCurrency === 'MXN') {
      return price / exchangeRate;
    } else if (currency === 'MXN' && bondCurrency === 'USD') {
      return price * exchangeRate;
    }
    return price;
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const handleBuy = async (bondId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }
      console.log(`Buying bond with ID: ${bondId}, Token: ${token}`);
      await axios.post(`http://localhost:8080/api/go/bonds/${bondId}/buy`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBonds(prevBonds => prevBonds.filter(bond => bond.id !== bondId));
    } catch (err) {
      console.error('Failed to buy bond:', err);
      setError('Failed to buy bond');
    }
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
      <main className="flex-grow container mx-auto p-4 mt-24">
        <h1 className="text-2xl font-bold mb-4">Available Bonds</h1>
        <div className="mb-4">
          <label className="block mb-2">Display Prices In</label>
          <select
            className="p-2 border border-gray-300 rounded"
            value={currency}
            onChange={handleCurrencyChange}
          >
            <option value="MXN">MXN</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Number</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Currency</th>
              <th className="py-2 px-4 border-b">Seller ID</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {bonds.map(bond => (
              <tr key={bond.id}>
                <td className="py-2 px-4 border-b">{bond.id}</td>
                <td className="py-2 px-4 border-b">{bond.name}</td>
                <td className="py-2 px-4 border-b">{bond.number}</td>
                <td className="py-2 px-4 border-b">{convertPrice(bond.price, bond.currency).toFixed(2)}</td>
                <td className="py-2 px-4 border-b">{currency}</td>
                <td className="py-2 px-4 border-b">{bond.seller_id}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleBuy(bond.id)}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    Buy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
};

export default BondList;
