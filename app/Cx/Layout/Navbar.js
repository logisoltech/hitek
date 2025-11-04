'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
  FaYoutube,
  FaChevronDown
} from 'react-icons/fa';
import { 
  CiShoppingCart,
  CiHeart,
  CiUser,
  CiHome,
  CiLaptop,
  CiMonitor,
  CiPhone,
  CiSearch,
  CiMenuBurger,
  CiMenuFries,
  CiBoxes
} from 'react-icons/ci';

import { PiDesktopTowerThin } from "react-icons/pi";
import { IoPrintOutline } from "react-icons/io5";
import { PiRecycleLight } from "react-icons/pi";
import { GrRotateRight } from "react-icons/gr";
import { openSans } from '../Font/font';


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full">
      {/* Top Bar - Welcome & Social Media */}
      <div className="bg-[#00aeef] text-white py-2 px-8 hidden md:flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm">Welcome to Hi-Tek Computers.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Follow us:</span>
          <div className="flex items-center gap-3">
            <FaFacebook className="cursor-pointer hover:text-blue-200 transition" />
            <FaInstagram className="cursor-pointer hover:text-blue-200 transition" />
            <FaTiktok className="cursor-pointer hover:text-blue-200 transition" />
            <FaLinkedin className="cursor-pointer hover:text-blue-200 transition" />
            <FaYoutube className="cursor-pointer hover:text-blue-200 transition" />
          </div>
          <div className="flex items-center gap-2 px-2 py-1 border border-white/30 rounded cursor-pointer hover:bg-white/10">
            <span className="text-sm">Eng</span>
            <FaChevronDown className="text-xs" />
          </div>
          <div className="flex items-center gap-2 px-2 py-1 border border-white/30 rounded cursor-pointer hover:bg-white/10">
            <span className="text-sm">PKR</span>
            <FaChevronDown className="text-xs" />
          </div>
        </div>
      </div>

      {/* Middle Bar - Logo, Search & Icons */}
      <div className="bg-black text-white py-4 px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image 
              src="/navbar-logo.png" 
              alt="Hi-Tek Computers Logo" 
              width={120} 
              height={60}
              className="object-contain"
            />
          </div>

          {/* Search Bar */}
          <div className="flex-1 w-full lg:w-auto max-w-2xl">
            <div className="flex rounded overflow-hidden">
              <button className="bg-gray-300 text-gray-700 px-4 py-3 flex items-center gap-2 border-r border-gray-400">
                <span className="text-sm font-medium">All Categories</span>
                <FaChevronDown className="text-xs" />
              </button>
              <input 
                type="text" 
                placeholder="Search for anything..." 
                className="flex-1 px-4 py-3 text-gray-900 bg-white focus:outline-none"
              />
              <button className="bg-white text-gray-700 px-6 py-3 hover:bg-gray-100 transition">
                <CiSearch />
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <CiShoppingCart className="text-2xl cursor-pointer hover:text-gray-300 transition" />
              <span className="absolute -top-2 -right-2 bg-[#00aeef] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                2
              </span>
            </div>
            <CiHeart className="text-2xl cursor-pointer hover:text-gray-300 transition" />
            <CiUser className="text-2xl cursor-pointer hover:text-gray-300 transition" />
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden text-2xl" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <CiMenuFries /> : <CiMenuBurger />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Navigation */}
      <div className="bg-[#00aeef] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <a href="#" className="flex items-center gap-2 px-4 py-4 bg-transparent hover:bg-[#00688f] transition">
                <CiHome className="text-2xl" />
                <span className="text-sm font-medium">Home</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-4 hover:bg-[#00688f] transition">
                <span className="text-sm">All Products</span>
                <FaChevronDown className="text-xs" />
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-4 hover:bg-[#00688f] transition">
                <CiLaptop className="text-2xl" />
                <span className="text-sm">Laptops</span>
                <FaChevronDown className="text-xs" />
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-4 hover:bg-[#00688f] transition">
                <PiDesktopTowerThin className="text-2xl" />
                <span className="text-sm">Desktop PCs</span>
                <FaChevronDown className="text-xs" />
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-4 hover:bg-[#00688f] transition">
                <IoPrintOutline className="text-2xl" />
                <span className="text-sm">Printers & Toners</span>
                <FaChevronDown className="text-xs" />
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-4 hover:bg-[#00688f] transition">
                <CiMonitor className="text-2xl" />
                <span className="text-sm">LED Monitors</span>
                <FaChevronDown className="text-xs" />
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-4 hover:bg-[#00688f] transition">
                <GrRotateRight className="text-2xl" />
                <span className="text-sm">Refurbished</span>
                <FaChevronDown className="text-xs" />
              </a>
            </div>

            {/* Mobile Navigation */}
            <div className={`lg:hidden w-full ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
              <div className="flex flex-col">
                <a href="#" className="flex items-center gap-2 px-4 py-3 bg-[#00688f] border-b border-[#00aeef]">
                  <CiHome className="text-xl" />
                  <span className="text-sm font-medium">Home</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-3 border-b border-[#00aeef] hover:bg-[#00688f]">
                  <CiBoxes className="text-xl" />
                  <span className="text-sm">All Products</span>
                  <FaChevronDown className="ml-auto" />
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-3 border-b border-[#00aeef] hover:bg-[#00688f]">
                  <CiLaptop className="text-xl" />
                  <span className="text-sm">Laptops</span>
                  <FaChevronDown className="ml-auto" />
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-3 border-b border-[#00aeef] hover:bg-[#00688f]">
                  <PiDesktopTowerThin className="text-xl" />
                  <span className="text-sm">Desktop PCs</span>
                  <FaChevronDown className="ml-auto" />
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-3 border-b border-[#00aeef] hover:bg-[#00688f]">
                  <IoPrintOutline className="text-xl" />
                  <span className="text-sm">Printers & Toners</span>
                  <FaChevronDown className="ml-auto" />
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-3 border-b border-[#00aeef] hover:bg-[#00688f]">
                  <CiMonitor className="text-xl" />
                  <span className="text-sm">LED Monitors</span>
                  <FaChevronDown className="ml-auto" />
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-3 border-b border-[#00aeef] hover:bg-[#00688f]">
                  <GrRotateRight className="text-xl" />
                  <span className="text-sm">Refurbished</span>
                  <FaChevronDown className="ml-auto" />
                </a>
              </div>
            </div>

            {/* Phone Number */}
            <div className="hidden lg:flex items-center gap-2 px-6 py-4 border-l border-[#00aeef]">
              <CiPhone />
              <span className="font-medium">+92-213-2410225</span>
            </div>
          </div>

          {/* Mobile Phone Number */}
          <div className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 border-t border-[#00aeef]">
            <CiPhone className='text-2xl'/>
            <span className="font-medium">+92-213-2410225</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;