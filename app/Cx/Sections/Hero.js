'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PiPackageThin } from "react-icons/pi";
import { CiTrophy } from "react-icons/ci";
import { CiCreditCard1 } from "react-icons/ci";
import { CiHeadphones } from "react-icons/ci";
import { FiArrowRight } from "react-icons/fi";
import { openSans } from '../Font/font';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    { 
      src: '/main-banner.png', 
      alt: 'HP Victus Laptop Banner',
      hasOverlay: false 
    },
    { 
      src: '/hero-banner-3.png', 
      alt: 'Hero Banner 3',
      hasOverlay: true,
      overlayType: 'printers' // Print, Copy, Scan Workflow Heroes
    },
    { 
      src: '/hero-banner-2.png', 
      alt: 'Hero Banner 2',
      hasOverlay: true,
      overlayType: 'monitors' // New & Refurbished LCD Monitors
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className={`w-full ${openSans.className}`}>
      {/* Main Banner Carousel */}
      <div className="w-full relative overflow-hidden">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <Image 
                src={banner.src} 
                alt={banner.alt} 
                width={1920}
                height={600}
                className="w-full h-auto object-cover"
                priority={index === 0}
              />
              
              {/* Overlay for Banner 3 - Printers */}
              {banner.hasOverlay && banner.overlayType === 'printers' && (
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 w-full">
                    <div className="max-w-md">
                      <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold mb-2">
                        Print, Copy, Scan
                      </h2>
                      <h3 className="text-[#00aeef] text-4xl sm:text-5xl md:text-6xl font-black mb-6 whitespace-nowrap">
                        Workflow Heroes
                      </h3>
                      <Link
                        href="/all-products"
                        className="inline-flex items-center gap-2 bg-[#00aeef] hover:bg-[#0099d9] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                      >
                        SHOP NOW
                        <FiArrowRight className="text-lg" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Overlay for Banner 2 - Monitors */}
              {banner.hasOverlay && banner.overlayType === 'monitors' && (
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 w-full">
                    <div className="max-w-md">
                      <h2 className="text-gray-700 text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
                        New & Refurbished
                      </h2>
                      <h3 className="text-[#00aeef] text-3xl sm:text-4xl md:text-5xl font-black mb-6">
                        LCD Monitors
                      </h3>
                      <Link
                        href="/all-products"
                        className="inline-flex items-center gap-2 bg-[#00aeef] hover:bg-[#0099d9] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                      >
                        SHOP NOW
                        <FiArrowRight className="text-lg" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
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