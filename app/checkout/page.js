'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiShield } from 'react-icons/fi';
import Navbar from '../Cx/Layout/Navbar';
import Footer from '../Cx/Layout/Footer';
import { openSans } from '../Cx/Font/font';

const formatCurrency = (value) => {
  const numeric = Number(value) || 0;
  return `PKR ${numeric.toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;
};

const paymentMethods = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    image: '/cod.png',
    helper: 'Pay when the order arrives at your doorstep.',
  },
  {
    id: 'easypaisa',
    label: 'Easy Paisa',
    image: '/easypaisa.png',
    helper: 'Use Easy Paisa mobile wallet for instant payment.',
  },
  {
    id: 'sadapay',
    label: 'SadaPay',
    image: '/sadapay.png',
    helper: 'Secure payment through SadaPay wallet.',
  },
  {
    id: 'nayapay',
    label: 'NayaPay',
    image: '/nayapay.png',
    helper: 'Pay using your NayaPay wallet.',
  },
  {
    id: 'card',
    label: 'Debit/Credit Card',
    image: '/CreditCard.png',
    helper: 'Visa, MasterCard and UnionPay accepted.',
  },
];

const CheckoutPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    country: '',
    region: '',
    city: '',
    zipCode: '',
    email: '',
    phone: '',
  });
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError('');

      try {
        const response = await fetch('http://localhost:3001/api/laptops');
        if (!response.ok) {
          throw new Error('Failed to load products. Please try again.');
        }

        const data = await response.json();
        const normalizedItems = (Array.isArray(data) ? data : []).map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price) || 0,
          quantity: 1,
          image: item.image || '',
          brand: item.brand || '',
          model: item.model || '',
        }));

        if (normalizedItems.length === 0) {
          setProductsError('No products available yet.');
        }

        setCartItems(normalizedItems);
      } catch (error) {
        console.error('Error fetching products for checkout:', error);
        setProductsError(error.message || 'Failed to load products.');
        setCartItems([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const { subTotal, taxAmount, total } = useMemo(() => {
    const subTotalValue = cartItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
      0,
    );
    const taxValue = Math.round(subTotalValue * 0.02);
    return {
      subTotal: subTotalValue,
      taxAmount: taxValue,
      total: subTotalValue + taxValue,
    };
  }, [cartItems]);

  const handleBillingChange = (field) => (event) => {
    setBillingInfo((prev) => ({ ...prev, [field]: event.target.value }));
    setStatusMessage('');
  };

  const handleCardChange = (field) => (event) => {
    setCardInfo((prev) => ({ ...prev, [field]: event.target.value }));
    setStatusMessage('');
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (productsLoading) {
      setStatusMessage('Please wait while we load your products.');
      return;
    }

    if (cartItems.length === 0) {
      setStatusMessage('Your cart is empty. Add a product before placing the order.');
      return;
    }

    if (!billingInfo.firstName || !billingInfo.lastName || !billingInfo.address || !billingInfo.phone) {
      setStatusMessage('Please fill in all required billing fields before placing the order.');
      return;
    }

    if (paymentMethod === 'card' && (!cardInfo.name || !cardInfo.number || !cardInfo.expiry || !cardInfo.cvc)) {
      setStatusMessage('Please provide complete card details.');
      return;
    }

    setStatusMessage('Order placed successfully! Redirecting to confirmation page...');

    setTimeout(() => {
      router.push('/order-confirmation');
    }, 1500);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white ${openSans.className}`}>
      <Navbar />

      {/* Breadcrumb */}
      <div className="sticky top-0 z-30 bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#00aeef] transition">
              Home
            </Link>
            <span className="text-[#00aeef]">›</span>
            <Link href="/cart" className="hover:text-[#00aeef] transition">
              Your Cart
            </Link>
            <span className="text-[#00aeef]">›</span>
            <span className="text-[#00aeef] font-medium">Check Out</span>
          </nav>
        </div>
      </div>

      <main className="grow  py-12">
        <div className="container mx-auto px-4">
          <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-8">
              <section className="bg-white  rounded-xs  p-6">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-gray-100 pb-4 mb-6">
                  <h1 className="text-lg font-bold text-gray-800">Billing Information</h1>
                  <span className="text-xs text-gray-500">
                    Fields marked with * are required.
                  </span>
                </div>

                {statusMessage && (
                  <div className="mb-6 rounded-xs border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    {statusMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm  text-gray-700 mb-2">
                      First name *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.firstName}
                      onChange={handleBillingChange('firstName')}
                      placeholder="First name"
                      className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm  text-gray-700 mb-2">
                      Last name *
                    </label>
                    <input
                      type="text"
                      value={billingInfo.lastName}
                      onChange={handleBillingChange('lastName')}
                      placeholder="Last name"
                      className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mt-4">
                  <div>
                    <label className="block text-sm  text-gray-700 mb-2">
                      Company name <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={billingInfo.company}
                      onChange={handleBillingChange('company')}
                      placeholder="Company name"
                      className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm  text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={billingInfo.phone}
                      onChange={handleBillingChange('phone')}
                      placeholder="Phone number"
                      className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm  text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={billingInfo.address}
                    onChange={handleBillingChange('address')}
                    placeholder="Street address"
                    className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-sm  text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      value={billingInfo.country}
                      onChange={handleBillingChange('country')}
                      className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="PK">Pakistan</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm  text-gray-700 mb-2">
                      Region/State *
                    </label>
                    <select
                      value={billingInfo.region}
                      onChange={handleBillingChange('region')}
                      className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="KPK">Khyber Pakhtunkhwa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm  text-gray-700 mb-2">
                      City *
                    </label>
                    <select
                      value={billingInfo.city}
                      onChange={handleBillingChange('city')}
                      className="w-full rounded-xs border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm  text-gray-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={billingInfo.zipCode}
                      onChange={handleBillingChange('zipCode')}
                      placeholder="Postal code"
                      className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm  text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={billingInfo.email}
                      onChange={handleBillingChange('email')}
                      placeholder="Email address"
                      className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                      required
                    />
                  </div>
                  <div className="flex items-start gap-3 pt-7">
                    <input
                      id="shipDifferent"
                      type="checkbox"
                      checked={shipToDifferent}
                      onChange={(event) => setShipToDifferent(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded-xs border border-gray-300 text-[#00aeef] focus:ring-[#00aeef]"
                    />
                    <label htmlFor="shipDifferent" className="text-sm text-gray-700">
                      Ship into different address
                    </label>
                  </div>
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-xs  p-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
                  <FiShield className="text-[#00aeef]" />
                  <h2 className="text-lg font-bold text-gray-800">Payment Option</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {paymentMethods.map((method) => {
                    const isActive = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xs px-4 py-4 text-sm  transition ${
                          isActive ? 'bg-[#00aeef]/10 text-[#00aeef] border-[#00aeef]' : 'text-gray-600 hover:border-[#00aeef] hover:text-[#00aeef]'
                        }`}
                      >
                        <div className="h-6 w-6 relative">
                          <Image
                            src={method.image}
                            alt={method.label}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="text-center leading-snug">{method.label}</span>
                        <div
                          className={`h-2 w-2 rounded-full border ${
                            isActive ? 'border-[#00aeef] bg-[#00aeef]' : 'border-gray-300 bg-white'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {paymentMethod !== 'card' && (
                  <p className="mt-5 text-sm text-gray-600">
                    You selected <span className=" text-gray-800">{paymentMethods.find((method) => method.id === paymentMethod)?.label}</span>. 
                    Our support team will reach out with instructions to complete the payment.
                  </p>
                )}

                {paymentMethod === 'card' && (
                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm  text-gray-700 mb-2">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        value={cardInfo.name}
                        onChange={handleCardChange('name')}
                        placeholder="Full name as displayed on card"
                        className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm  text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cardInfo.number}
                        onChange={handleCardChange('number')}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm  text-gray-700 mb-2">
                          Expire Date *
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardInfo.expiry}
                          onChange={handleCardChange('expiry')}
                          className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm  text-gray-700 mb-2">
                          CVC *
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardInfo.cvc}
                          onChange={handleCardChange('cvc')}
                          className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-white  rounded-xs  p-6">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-lg font-bold text-gray-800">Additional Information</h2>
                  <p className="text-xs text-gray-500 mt-1">Order notes <span className="text-gray-400">(Optional)</span></p>
                </div>
                <textarea
                  value={orderNotes}
                  onChange={(event) => setOrderNotes(event.target.value)}
                  rows={4}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                />
              </section>
            </div>

            <aside className="bg-white border border-gray-200 rounded-xs  h-fit">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg  text-gray-800 mb-1">Order Summary</h2>
                <p className="text-xs text-gray-500">Review your order details before placing it.</p>
              </div>

              {productsLoading ? (
                <div className="px-6 py-8 text-sm text-gray-600 text-center">
                  Loading products...
                </div>
              ) : cartItems.length === 0 ? (
                <div
                  className={`px-6 py-8 text-sm text-center ${
                    productsError ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {productsError || 'No products in your cart.'}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                      <div className="hidden md:flex h-14 w-20 items-center justify-center rounded-xs bg-gray-100 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-sm text-gray-500">
                            {(item.brand || item.model || 'LP').toString().slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 leading-snug">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.quantity} ×{' '}
                          <span className="text-[#00aeef]">{formatCurrency(item.price)}</span>
                        </p>
                      </div>
                      <span className="text-sm text-gray-900">
                        {formatCurrency((Number(item.price) || 0) * (item.quantity || 0))}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="px-6 py-5 space-y-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Sub-total</span>
                  <span>{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Shipping</span>
                  <span className="text-green-500 ">Free</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Discount</span>
                  <span>N/A</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Tax</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-base  text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="px-6 py-5 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={productsLoading || cartItems.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xs bg-[#00aeef] px-5 py-3 text-sm  text-white hover:bg-[#0099d9] disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  PLACE ORDER <FiArrowRight className="text-base" />
                </button>
              </div>
            </aside>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
