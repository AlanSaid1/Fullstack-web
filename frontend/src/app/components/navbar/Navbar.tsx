"use client";

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import cicadatech_logo from '@/images/cicadatech_logo.jpg';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 shadow-lg fixed w-full z-20 top-0 left-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3">
          <Image src={cicadatech_logo} alt="Logo" width={40} height={40} />
          <span className="self-center text-xl font-semibold text-white">CicadaTech</span>
        </Link>
        <div className="flex md:order-2 space-x-3">
          <Link href="/bond-list">
            <button
              type="button"
              className="text-white hover:bg-customCyan focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition duration-300"
            >
              Buy Bonds
            </button>
          </Link>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-customCyan focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-800 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-gray-900">
            <li>
              <Link
                href="/"
                className="block py-2 pl-4 pr-4 text-white hover:bg-customCyan rounded-lg md:bg-transparent md:p-2"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/user-bonds"
                className="block py-2 pl-4 pr-4 text-white hover:bg-customCyan rounded-lg md:bg-transparent md:p-2"
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
