import React from 'react';

interface Bond {
  id: number;
  name: string;
  price: number;
  currency: string;
  number: number;
  buyer_id: number | null;
}

interface BondListProps {
  bonds: Bond[];
}

const BondList: React.FC<BondListProps> = ({ bonds }) => {
  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="py-2">ID</th>
          <th className="py-2">Name</th>
          <th className="py-2">Price</th>
          <th className="py-2">Currency</th>
          <th className="py-2">Number</th>
          <th className="py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {bonds.map(bond => (
          <tr key={bond.id} className="border-t">
            <td className="py-2">{bond.id}</td>
            <td className="py-2">{bond.name}</td>
            <td className="py-2">{bond.price}</td>
            <td className="py-2">{bond.currency}</td>
            <td className="py-2">{bond.number}</td>
            <td className="py-2">{bond.buyer_id ? 'Bought' : 'Available'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BondList;
