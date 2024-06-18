"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/go/login', { username, password });
      if (res.status === 200) {
        console.log('token:', res.data.token);
        localStorage.setItem('token', res.data.token); // Guardar el token en localStorage
        router.push('/');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <section className="bg-gray-900 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-2xl rounded-lg p-10 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">Welcome to BondSwap!</h1>
        <p className="text-center text-customCyan font-medium mb-6 ">by Cicada</p>
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 mb-6 text-center">Sign in to your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline mb-4"
            >
              Login
            </button>
            <Link href="/register" className="text-blue-500 hover:text-blue-800 text-sm font-bold">
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
