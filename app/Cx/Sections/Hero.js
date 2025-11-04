'use client';

import React from 'react';
import Image from 'next/image';
import { PiPackageThin } from "react-icons/pi";
import { CiTrophy } from "react-icons/ci";
import { CiCreditCard1 } from "react-icons/ci";
import { CiHeadphones } from "react-icons/ci";
import { openSans } from '../Font/font';

const Hero = () => {
  return (
    <div className={`w-full ${openSans.className}`}>
      {/* Main Banner Image */}
      <div className="w-full">
        <Image 
          src="/main-banner.png" 
          alt="HP Victus Laptop Banner" 
          width={1920}
          height={600}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* Feature Section */}
      <div className="bg-white py-8 mt-8 border border-gray-300 rounded-2xl max-w-[97%] justify-center items-center mx-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Feature 1 - Faster Delivery */}
            <div className="flex  items-center justify-center text-center gap-3">
              <PiPackageThin className="text-4xl text-gray-900" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">FASTER DELIVERY</h3>
                <p className="text-sm text-gray-600">Delivery in 24/H</p>
              </div>
            </div>

            {/* Feature 2 - 24 Hours Return */}
            <div className="flex  items-center justify-center text-center gap-3">
              <CiTrophy className="text-4xl text-gray-900" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">24 HOURS RETURN</h3>
                <p className="text-sm text-gray-600">100% money-back guarantee</p>
              </div>
            </div>

            {/* Feature 3 - Secure Payment */}
            <div className="flex  items-center justify-center text-center gap-3">
              <CiCreditCard1 className="text-4xl text-gray-900" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">SECURE PAYMENT</h3>
                <p className="text-sm text-gray-600">Your money is safe</p>
              </div>
            </div>

            {/* Feature 4 - Support 24/7 */}
            <div className="flex  items-center justify-center text-center gap-3">
              <CiHeadphones className="text-4xl text-gray-900" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">SUPPORT 24/7</h3>
                <p className="text-sm text-gray-600">Live contact/message</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero