'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMinus, FiPlus, FiTrash2, FiArrowRight } from 'react-icons/fi';
import Navbar from '../Cx/Layout/Navbar';
import Footer from '../Cx/Layout/Footer';
import { openSans } from '../Cx/Font/font';

const initialCartItems = [
  {
    id: 1,
    name: '4K UHD LED Smart TV with Chromecast Built-in',
    price: 60000,
    quantity: 1,
    thumbnailLabel: 'TV',
  },
  {
    id: 2,
    name: 'Wired Over-Ear Gaming Headphones with USB',
    price: 10000,
    quantity: 3,
    thumbnailLabel: 'HP',
  },
];

const formatCurrency = (value) =>
  `PKR ${value.toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const { subTotal, taxAmount, total } = useMemo(() => {
    const subTotalValue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxValue = Math.round(subTotalValue * 0.02); // 2% tax to mirror design
    return {
      subTotal: subTotalValue,
      taxAmount: taxValue,
      total: subTotalValue + taxValue,
    };
  }, [cartItems]);

  const handleIncrement = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, 9) } : item,
      ),
    );
    setStatusMessage('');
  };

  const handleDecrement = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item,
      ),
    );
    setStatusMessage('');
  };

  const handleRemoveItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    setStatusMessage('Item removed from cart.');
  };

  const handleUpdateCart = () => {
    setStatusMessage('Cart updated successfully.');
  };

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      setStatusMessage('Enter a coupon code to apply.');
      return;
    }
    setStatusMessage(`Coupon "${couponCode.trim()}" applied!`);
  };

  const renderEmptyState = () => (
    <div className="p-8 text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is currently empty</h3>
      <p className="text-sm text-gray-500 mb-6">
        Explore our latest products and add your favorites to the cart.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xs bg-[#00aeef] text-white font-semibold hover:bg-[#0099d9] transition"
      >
        Continue Shopping
      </Link>
    </div>
  );

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
            <span className="text-[#00aeef] font-medium">Your Cart</span>
          </nav>
        </div>
      </div>

      <main className="grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2 bg-white border border-gray-200 rounded-xs shadow-sm overflow-hidden">
              <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h1 className="text-lg font-semibold text-gray-800">Shopping Cart</h1>
                <span className="text-sm text-gray-500">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </span>
              </header>

              {statusMessage && (
                <div className="mx-6 mt-4 rounded-xs border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  {statusMessage}
                </div>
              )}

              {cartItems.length === 0 ? (
                renderEmptyState()
              ) : (
                <>
                  <div className="px-6 py-4 hidden bg-gray-200 md:grid grid-cols-[1.5fr_repeat(3,minmax(0,1fr))] text-xs font-medium uppercase tracking-wide text-gray-500">
                    <span>Products</span>
                    <span className="text-right">Price</span>
                    <span className="text-center">Quantity</span>
                    <span className="text-right">Sub-total</span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col md:grid md:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))] items-center px-6 py-5 gap-4"
                      >
                        <div className="flex w-full items-center gap-4">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition"
                            aria-label={`Remove ${item.name}`}
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                          <div className="hidden md:flex h-16 w-24 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-500">
                            {item.thumbnailLabel}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 leading-snug">
                              {item.name}
                            </p>
                          </div>
                        </div>

                        <div className="w-full md:w-auto text-right text-sm font-medium text-gray-700">
                          {formatCurrency(item.price)}
                        </div>

                        <div className="w-full md:w-auto flex items-center justify-center">
                          <div className="inline-flex items-center overflow-hidden rounded-xs border border-gray-200">
                            <button
                              type="button"
                              onClick={() => handleDecrement(item.id)}
                              className="h-10 w-10 flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100"
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <FiMinus />
                            </button>
                            <span className="h-10 w-12 flex items-center justify-center text-sm font-semibold text-gray-800 bg-white">
                              {item.quantity.toString().padStart(2, '0')}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncrement(item.id)}
                              className="h-10 w-10 flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100"
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <FiPlus />
                            </button>
                          </div>
                        </div>

                        <div className="w-full md:w-auto text-right text-sm font-semibold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <footer className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center rounded-xs border border-[#00aeef] px-5 py-3 text-sm font-semibold text-[#00aeef] hover:bg-[#00aeef] hover:text-white transition"
                    >
                      RETURN TO SHOP
                    </Link>
                    <button
                      type="button"
                      onClick={handleUpdateCart}
                      className="inline-flex items-center justify-center rounded-xs bg-[#00aeef] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0099d9] transition"
                    >
                      UPDATE CART
                    </button>
                  </footer>
                </>
              )}
            </section>

            <aside className="bg-white border border-gray-200 rounded-xs shadow-sm h-fit">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Card Totals</h2>
                <p className="text-xs text-gray-500">
                  Review your order and proceed to checkout.
                </p>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Sub-total</span>
                  <span>{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Shipping</span>
                  <span className="text-green-500 font-semibold">Free</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Discount</span>
                  <span>N/A</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Tax</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xs bg-[#00aeef] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0099d9] transition"
                >
                  PROCEED TO CHECKOUT <FiArrowRight className="text-base" />
                </button>
              </div>

              <div className="border-t border-gray-100 px-6 py-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                  Coupon Code
                </h3>
                <form onSubmit={handleApplyCoupon} className="space-y-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Email address"
                    className="w-full rounded-xs border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00aeef] focus:ring-2 focus:ring-[#00aeef]/20"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xs border border-[#00aeef] px-4 py-3 text-sm font-semibold text-[#00aeef] hover:bg-[#00aeef] hover:text-white transition"
                  >
                    APPLY COUPON
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
