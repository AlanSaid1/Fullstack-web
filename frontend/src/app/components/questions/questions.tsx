import React from 'react';

const Questions: React.FC = () => {
  const faqs = [
    {
      question: "What is a bond?",
      answer: "A bond is a debt instrument issued by an entity such as a company or the government to raise capital. Investors who buy bonds are lending money to the issuing entity in exchange for periodic interest payments and repayment of the face value of the bond at maturity."
    },
    {
      question: "Why invest in bonds?",
      answer: "Investing in bonds can provide regular income through interest payments, diversify an investment portfolio and reduce risk compared to stocks. Bonds can also offer tax benefits and long-term financial stability."
    },
    {
        question: "What type of bonuses does the platform offer?",
        answer: "Our platform offers a diverse range of bonds to cater to different investment needs and risk profiles. We provide access to government bonds, corporate bonds, municipal bonds, and high-yield bonds. This variety allows investors to build a well-rounded portfolio according to their investment goals and risk tolerance."
    },
    {
        question: "Is there any kind of fee when buying bonds?",
        answer: "Yes, our platform charges a minimal transaction fee for buying and selling bonds. We strive to keep our fees competitive and transparent, ensuring that there are no hidden costs. Detailed information about our fee structure is readily available on our website and during the transaction process, allowing investors to make informed decisions."
    },
    {
        question: "Is the platform regulated by any financial entity?",
        answer: "Absolutely. Our platform is fully regulated by CNBV, ensuring compliance with all necessary financial regulations and standards. This regulation provides an added layer of security and trust, as we adhere to strict guidelines to protect our investors' interests and assets."
    },

  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-5 mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">Why joining Cicada?</h2>
      <div className="bg-blue-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Our platform stands out for:</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Wide variety of available bonds</li>
          <li>Competitive and transparent rates</li>
          <li>Reliable regulation</li>
          <li>Intuitive and user-friendly interface</li>
          <li>Robust security measures</li>
          <li>Excellent customer service</li>
        </ul>
        <p className="text-gray-700 mt-4">All this makes it the best choice in the market for bond investments.</p>
      </div><br/>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
          <p className="text-gray-700">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
  
};

export default Questions;
