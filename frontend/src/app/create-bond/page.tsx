"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';

const BondForm: React.FC = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/go/bonds', { name, number, price, currency: 'MXN' }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      router.push('/bonds');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Bond</button>
    </form>
  );
};

export default BondForm;
