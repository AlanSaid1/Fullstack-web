import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">BondSwap</h2>
          </div>
          <div className="w-full md:w-auto">
            <ul className="flex flex-wrap">
              <li className="mr-6">
                <a href="#" className="text-white hover:text-gray-400">About</a>
              </li>
              <li className="mr-6">
                <a href="#" className="text-white hover:text-gray-400">Privacy Policy</a>
              </li>
              <li className="mr-6">
                <a href="#" className="text-white hover:text-gray-400">Licensing</a>
              </li>
              <li className="mr-6">
                <a href="#" className="text-white hover:text-gray-400">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4 border-t border-white pt-4 text-center">
          <p className="text-xs">© 2024 BondSwap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
