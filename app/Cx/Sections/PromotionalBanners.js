'use client';

import React from 'react';
import Image from 'next/image';

const PromotionalBanners = () => {
  return (
    <div className="w-full py-8 lg:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HP LaserJet Banner */}
          <div className="relative rounded-lg overflow-hidden group cursor-pointer">
            <Image 
              src="/blue-Banner.png" 
              alt="HP LaserJet Toners and Drum Units" 
              width={800}
              height={400}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center p-6">
              <div>
                <div className="bg-[#00aeef] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                  INTRODUCING
                </div>
                <h2 className="text-2xl max-w-xs lg:text-3xl font-bold text-white mb-2">
                  HP LaserJet Toners and Drum Units
                </h2>
              </div>
            </div>
          </div>

          {/* ViewSonic Monitor Banner */}
          <div className="relative rounded-lg overflow-hidden group cursor-pointer">
            <Image 
              src="/Drk-blue-Banner.png" 
              alt="24 Viewsonic LED Monitor" 
              width={800}
              height={400}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent flex items-center p-6">
              <div>
                <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                  LATEST PRODUCT
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
                  24" Viewsonic LED<br />VA2436 SERIES<br />FULL HD.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanners;

