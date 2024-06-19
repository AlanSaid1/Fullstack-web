"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

const BondForm: React.FC = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [currency, setCurrency] = useState('MXN');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/go/bonds', { name, number, price, currency}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      router.push('/bond-list');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 mt-24">
        <h1 className="text-2xl font-bold mb-4">Create Bond</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Number</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={number}
              onChange={(e) => setNumber(parseInt(e.target.value))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Price</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
            />
            </div>
      <div className="mb-4">
        <label className="block mb-2">Currency</label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          required
        >
          <option value="MXN">MXN</option>
          <option value="USD">USD</option>
        </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Bond</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default BondForm;
