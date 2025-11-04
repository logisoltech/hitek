'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import { 
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
  FaYoutube,
  FaChevronDown,
  FaChevronRight
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
import ShoppingCartPopup from '../Components/ShoppingCartPopup';
import LoginPopup from '../Components/LoginPopup';


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isAllProductsHovered, setIsAllProductsHovered] = useState(false);
  const [isLaptopsHovered, setIsLaptopsHovered] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('HP');

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
            <div 
              className="relative"
              onMouseEnter={() => setIsCartHovered(true)}
              onMouseLeave={() => setIsCartHovered(false)}
            >
              <CiShoppingCart className="text-2xl cursor-pointer hover:text-gray-300 transition" />
              <span className="absolute -top-2 -right-2 bg-[#00aeef] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                2
              </span>
              {isCartHovered && (
                <>
                  {/* Invisible bridge to maintain hover across the gap */}
                  <div 
                    className="absolute top-full right-0 w-full h-2 pointer-events-auto z-40"
                    onMouseEnter={() => setIsCartHovered(true)}
                  />
                  <ShoppingCartPopup 
                    isOpen={isCartHovered} 
                    onClose={() => setIsCartHovered(false)} 
                  />
                </>
              )}
            </div>
            <CiHeart className="text-2xl cursor-pointer hover:text-gray-300 transition" />
            <div 
              className="relative"
              onMouseEnter={() => setIsProfileHovered(true)}
              onMouseLeave={() => setIsProfileHovered(false)}
            >
              <CiUser className="text-2xl cursor-pointer hover:text-gray-300 transition" />
              {isProfileHovered && (
                <>
                  {/* Invisible bridge to maintain hover across the gap */}
                  <div 
                    className="absolute top-full right-0 w-full h-2 pointer-events-auto z-40"
                    onMouseEnter={() => setIsProfileHovered(true)}
                  />
                  <LoginPopup 
                    isOpen={isProfileHovered} 
                    onClose={() => setIsProfileHovered(false)} 
                  />
                </>
              )}
            </div>
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
              <div 
                className="relative"
                onMouseEnter={() => setIsAllProductsHovered(true)}
                onMouseLeave={() => {
                  setIsAllProductsHovered(false);
                  setIsLaptopsHovered(false);
                }}
              >
                <a 
                  href="#" 
                  className={`flex items-center gap-2 px-4 py-4 transition ${
                    isAllProductsHovered ? 'bg-[#00688f]' : 'hover:bg-[#00688f]'
                  }`}
                >
                  <span className="text-sm">All Products</span>
                  <FaChevronDown className="text-xs" />
                </a>

                {/* All Products Dropdown */}
                {isAllProductsHovered && (
                  <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-200 shadow-lg rounded-sm z-50">
                    <div className="py-2">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition cursor-pointer">
                        Desktop PCs
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition cursor-pointer">
                        Printers
                      </a>
                      <div 
                        className="relative"
                        onMouseEnter={() => setIsLaptopsHovered(true)}
                        onMouseLeave={() => setIsLaptopsHovered(false)}
                      >
                        <a 
                          href="#" 
                          className={`flex items-center justify-between px-4 py-2 text-sm text-gray-900 transition cursor-pointer ${
                            isLaptopsHovered ? 'bg-gray-100' : 'hover:bg-gray-100'
                          }`}
                        >
                          <span>Laptops</span>
                          <FaChevronRight className="text-xs text-black" />
                        </a>

                        {/* Laptops Nested Dropdown */}
                        {isLaptopsHovered && (
                          <>
                            {/* Invisible bridge to maintain hover across the gap */}
                            <div 
                              className="absolute -top-[80px] left-full w-2 h-[600px] pointer-events-auto z-40"
                              onMouseEnter={() => setIsLaptopsHovered(true)}
                            />
                            <div 
                              className="absolute -top-[80px] left-full ml-2 w-[900px] bg-white border border-gray-200 shadow-lg z-50 p-6"
                              onMouseEnter={() => setIsLaptopsHovered(true)}
                              onMouseLeave={() => setIsLaptopsHovered(false)}
                            >
                            <div className="flex gap-6">
                              {/* Left Side - Brand Filters */}
                              <div className="w-40 shrink-0">
                                <div className="space-y-1">
                                  <button
                                    onClick={() => setSelectedBrand('All')}
                                    className={`w-full text-left px-4 py-2.5 text-sm text-black transition cursor-pointer ${
                                      selectedBrand === 'All' ? 'bg-gray-100' : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    All
                                  </button>
                                  <button
                                    onClick={() => setSelectedBrand('HP')}
                                    className={`w-full text-left px-4 py-2.5 text-sm text-black transition cursor-pointer ${
                                      selectedBrand === 'HP' ? 'bg-gray-100' : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    HP
                                  </button>
                                  <button
                                    onClick={() => setSelectedBrand('Dell')}
                                    className={`w-full text-left px-4 py-2.5 text-sm text-black transition cursor-pointer ${
                                      selectedBrand === 'Dell' ? 'bg-gray-100' : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    Dell
                                  </button>
                                  <button
                                    onClick={() => setSelectedBrand('Lenovo')}
                                    className={`w-full text-left px-4 py-2.5 text-sm text-black transition cursor-pointer ${
                                      selectedBrand === 'Lenovo' ? 'bg-gray-100' : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    Lenovo
                                  </button>
                                  <button
                                    onClick={() => setSelectedBrand('Acer')}
                                    className={`w-full text-left px-4 py-2.5 text-sm text-black transition cursor-pointer ${
                                      selectedBrand === 'Acer' ? 'bg-gray-100' : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    Acer
                                  </button>
                                  <button
                                    onClick={() => setSelectedBrand('Asus')}
                                    className={`w-full text-left px-4 py-2.5 text-sm text-black transition cursor-pointer ${
                                      selectedBrand === 'Asus' ? 'bg-gray-100' : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    Asus
                                  </button>
                                  <button
                                    onClick={() => setSelectedBrand('Samsung')}
                                    className={`w-full text-left px-4 py-2.5 text-sm text-black transition cursor-pointer ${
                                      selectedBrand === 'Samsung' ? 'bg-gray-100' : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    Samsung
                                  </button>
                                  <button
                                    onClick={() => setSelectedBrand('Chromebook')}
                                    className={`w-full text-left px-4 py-2.5 text-sm text-black transition cursor-pointer ${
                                      selectedBrand === 'Chromebook' ? 'bg-gray-100' : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    Chromebook
                                  </button>
                                </div>
                              </div>

                              {/* Middle - Featured Laptops Products */}
                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900 mb-4">FEATURED LAPTOPS</h4>
                                <div className="space-y-4">
                                  {/* Product 1 */}
                                  <div className="flex gap-4 items-center border-b border-gray-200 pb-4 hover:bg-gray-50 p-2 -m-2 rounded transition cursor-pointer">
                                    <div className="w-24 h-24 shrink-0">
                                      <Image
                                        src="/big-laptop.png"
                                        alt="HP VICTUS"
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-sm font-medium text-gray-900 mb-1">
                                        HP VICTUS 15-FA(X033DX) CORE 6-1245014, 8GB 512GB
                                      </h5>
                                      <p className="text-sm font-bold text-[#00aeef]">PKR 180,000</p>
                                    </div>
                                  </div>

                                  {/* Product 2 */}
                                  <div className="flex gap-4 items-center border-b border-gray-200 pb-4 hover:bg-gray-50 p-2 -m-2 rounded transition cursor-pointer">
                                    <div className="w-24 h-24 shrink-0">
                                      <Image
                                        src="/big-laptop.png"
                                        alt="HP OMEN"
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-sm font-medium text-gray-900 mb-1">
                                        HP OMEN 16T-WF100 GAMING I7-14700HX 16GB
                                      </h5>
                                      <p className="text-sm font-bold text-[#00aeef]">PKR 200,000</p>
                                    </div>
                                  </div>

                                  {/* Product 3 */}
                                  <div className="flex gap-4 items-center hover:bg-gray-50 p-2 -m-2 rounded transition cursor-pointer">
                                    <div className="w-24 h-24 shrink-0">
                                      <Image
                                        src="/big-laptop.png"
                                        alt="HP VICTUS"
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-sm font-medium text-gray-900 mb-1">
                                        HP VICTUS 15-FA0033 CI5 12TH GEN 8GB 512GB
                                      </h5>
                                      <div className="flex items-center gap-2">
                                        <p className="text-xs text-gray-400 line-through">PKR 160,500</p>
                                        <p className="text-sm font-bold text-[#00aeef]">PKR 110,000</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Side - Promotional Banner */}
                              <div className="w-64 shrink-0">
                                <div className="bg-gray-300 rounded-lg p-6 text-black h-full flex flex-col">
                                  <div className="mb-4">
                                    <Image
                                      src="/big-laptop.png"
                                      alt="HP OMEN 16"
                                      width={200}
                                      height={150}
                                      className="w-full h-auto object-contain"
                                    />
                                  </div>
                                  <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 inline-block mb-3">
                                    21% Discount
                                  </div>
                                  <h3 className="text-xl font-bold mb-2">HP OMEN 16</h3>
                                  <p className="text-sm text-gray-700 mb-4 flex-1">
                                    The HP OMEN 16 delivers impressive 1080p gaming performance perfect for midrange gamers.
                                  </p>
                                  <div className="mb-4">
                                    <p className="text-sm">
                                      <span className="text-gray-700">Starting price: </span>
                                      <span className="font-bold bg-white text-black px-2 py-1 rounded">PKR 150,000</span>
                                    </p>
                                  </div>
                                  <button className="bg-[#00aeef] hover:bg-[#0099d9] text-white px-6 py-2 rounded-sm font-bold flex items-center justify-center gap-2 transition w-full">
                                    SHOP NOW
                                    <FiArrowRight />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          </>
                        )}
                      </div>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition cursor-pointer">
                        Scanners
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition cursor-pointer">
                        Printer Toners
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition cursor-pointer">
                        Printer Cartridges
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition cursor-pointer">
                        LED Monitors
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition cursor-pointer">
                        Refurbished PCs
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition cursor-pointer">
                        Refurbished Laptops
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition cursor-pointer">
                        Accessories
                      </a>
                    </div>
                  </div>
                )}
              </div>
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