'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa';
import { openSans } from '../Font/font';

const Videos = () => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -330, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 330, behavior: 'smooth' });
    }
  };

  const videos = [
    {
      thumbnail: '/laptop-category.jpg',
      alt: 'Laptop Video'
    },
    {
      thumbnail: '/stacked-laptops.jpg',
      alt: 'Laptops Stack Video'
    },
    {
      thumbnail: '/monitor-category.png',
      alt: 'Monitor Video'
    },
    {
      thumbnail: '/hp-victus.jpg',
      alt: 'HP OMEN Video'
    },
    {
      thumbnail: '/laptop-category.jpg',
      alt: 'Laptop Video'
    }
  ];

  return (
    <div className={`w-full py-8 lg:py-12 bg-gray-50 ${openSans.className}`}>
      <div className="max-w-[1400px] mx-auto px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Like, Follow and Share</h2>
        
        <div className="relative px-12">
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#00aeef] hover:bg-[#0099d9] text-white rounded-full p-3 shadow-lg transition"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="text-xl" />
          </button>

          {/* Video Carousel */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videos.map((video, index) => (
              <div
                key={index}
                className="relative shrink-0 w-[306px] h-[433px] rounded-lg overflow-hidden group cursor-pointer"
              >
                <Image
                  src={video.thumbnail}
                  alt={video.alt}
                  fill
                  className="object-cover"
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#00aeef] hover:bg-[#0099d9] rounded-full flex items-center justify-center transition transform group-hover:scale-110">
                    <FaPlay className="text-white text-xl ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#00aeef] hover:bg-[#0099d9] text-white rounded-full p-3 shadow-lg transition"
            aria-label="Scroll right"
          >
            <FaChevronRight className="text-xl" />
          </button>
        </div>

        {/* Hide scrollbar for webkit browsers */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Videos;

