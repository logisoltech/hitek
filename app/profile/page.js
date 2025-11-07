'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FaRegUser, FaClipboardList, FaTruck, FaShoppingCart, FaRegHeart, FaAddressCard, FaHistory, FaCog, FaSignOutAlt, FaEllipsisH } from 'react-icons/fa';
import { FiChevronRight, FiMapPin, FiPhone, FiMail, FiEdit2 } from 'react-icons/fi';
import Navbar from '../Cx/Layout/Navbar';
import Footer from '../Cx/Layout/Footer';
import { openSans } from '../Cx/Font/font';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [historyPage, setHistoryPage] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (typeof window === 'undefined') return;
        const stored = window.localStorage.getItem('user');
        if (!stored) {
          setLoadingUser(false);
          return;
        }

        const parsed = JSON.parse(stored);
        const userId = parsed?.id;

        if (!userId) {
          setUserInfo(parsed);
          setLoadingUser(false);
          return;
        }

        const response = await fetch(`http://localhost:3001/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to load user profile');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Profile fetch error:', error);
        setUserError(error.message || 'Failed to load user profile.');
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      if (!userInfo?.id) {
        setOrders([]);
        setOrdersLoading(false);
        return;
      }

      setOrdersLoading(true);
      setOrdersError('');
      try {
        const response = await fetch(`http://localhost:3001/api/orders?userId=${userInfo.id}`);
        if (!response.ok) {
          throw new Error('Failed to load orders');
        }
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Orders fetch error:', error);
        setOrdersError(error.message || 'Failed to load orders.');
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [userInfo?.id]);

  const displayName = useMemo(() => {
    if (!userInfo) return 'Guest User';
    const combined = [userInfo.first_name, userInfo.last_name].filter(Boolean).join(' ');
    return combined || userInfo.email || 'Guest User';
  }, [userInfo]);

  const locationText = useMemo(() => {
    if (!userInfo) return 'Karachi, Pakistan';
    const locationParts = [userInfo.city, userInfo.province].filter(Boolean);
    return locationParts.length ? locationParts.join(', ') : 'Karachi, Pakistan';
  }, [userInfo]);

  const billingAddress = useMemo(() => {
    if (!userInfo) return 'Block 7, Gulshan-e-Iqbal, Street 12, House 45, Karachi-75300, Pakistan';
    const parts = [userInfo.shipment_address, userInfo.address, userInfo.city, userInfo.province].filter(Boolean);
    return parts.length ? parts.join(', ') : 'No billing address saved yet.';
  }, [userInfo]);

  const navigationItems = [
    { label: 'Dashboard', icon: <FaRegUser />, active: true },
    { label: 'Order History', icon: <FaClipboardList /> },
    { label: 'Track Order', icon: <FaTruck /> },
    { label: 'Shopping Cart', icon: <FaShoppingCart /> },
    { label: 'Wishlist', icon: <FaRegHeart /> },
    { label: 'Cards & Address', icon: <FaAddressCard /> },
    { label: 'Browsing History', icon: <FaHistory /> },
    { label: 'Setting', icon: <FaCog /> },
    { label: 'Log out', icon: <FaSignOutAlt /> },
  ];

  const stats = useMemo(() => {
    if (!userInfo) {
      return [
        { label: 'Total Orders', value: 0, color: 'bg-blue-100 text-blue-600' },
        { label: 'Pending Orders', value: 0, color: 'bg-orange-100 text-orange-600' },
        { label: 'Completed Orders', value: 0, color: 'bg-green-100 text-green-600' },
      ];
    }

    const formatStat = (val) => {
      if (val === null || val === undefined) return 0;
      if (typeof val === 'number') return val;
      const parsed = Number(val);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    return [
      {
        label: 'Total Orders',
        value: formatStat(userInfo.totalorders),
        color: 'bg-blue-100 text-blue-600',
      },
      {
        label: 'Pending Orders',
        value: formatStat(userInfo.pending),
        color: 'bg-orange-100 text-orange-600',
      },
      {
        label: 'Completed Orders',
        value: formatStat(userInfo.completed),
        color: 'bg-green-100 text-green-600',
      },
    ];
  }, [userInfo]);

  const paymentCards = [
    {
      brand: 'Visa',
      mask: '**** **** **** 3814',
      holder: 'Azlan Khan',
      color: 'bg-gradient-to-r from-sky-600 to-sky-500',
    },
    {
      brand: 'Mastercard',
      mask: '**** **** **** 1761',
      holder: 'Azlan Khan',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
    },
  ];

  const recentOrders = useMemo(() => {
    return orders.slice(0, 7).map((order) => {
      const itemCount = order.order_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      return {
        id: `#${order.id}`,
        status: order.status?.toUpperCase?.() || 'PENDING',
        date: order.created_at ? new Date(order.created_at).toLocaleString() : '—',
        total: `PKR ${Number(order.total || 0).toLocaleString('en-PK')} (${itemCount} Products)`,
      };
    });
  }, [orders]);

  const browsingHistory = useMemo(() => {
    const items = [];
    orders.forEach((order) => {
      (order.order_items || []).forEach((item) => {
        items.push({
          title: item.name,
          price: `PKR ${Number(item.price || 0).toLocaleString('en-PK')}`,
          image: item.metadata?.image || '/laptop-category.jpg',
          rating: 4.5,
          reviews: 120,
          badge: null,
        });
      });
    });
    return items.slice(0, 8);
  }, [orders]);

  const itemsPerHistoryPage = 4;
  const totalHistoryPages = Math.max(1, Math.ceil(browsingHistory.length / itemsPerHistoryPage));

  useEffect(() => {
    if (historyPage > totalHistoryPages - 1) {
      setHistoryPage(Math.max(0, totalHistoryPages - 1));
    }
  }, [historyPage, totalHistoryPages]);

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${openSans.className}`}>
      <Navbar />

      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#00aeef] transition">Home</Link>
            <span className="text-gray-500">›</span>
            <span className="text-[#00aeef]">User Profile</span>
          </nav>
        </div>
      </div>

      <main className="grow py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition ${
                      item.active
                        ? 'bg-[#00aeef] text-white shadow'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {!item.active && <FiChevronRight className="text-xs text-gray-400" />}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <section className="flex-1 space-y-6">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Assalam U Alaykum, {displayName}
              </h1>
              <p className="text-sm text-gray-600">
                From your profile, you can easily check &amp; view your{' '}
                <Link href="#" className="text-[#00aeef] hover:underline">
                  Recent Orders
                </Link>
                , manage your{' '}
                <Link href="#" className="text-[#00aeef] hover:underline">
                  Shipping and Billing Addresses
                </Link>{' '}
                and edit your{' '}
                <Link href="#" className="text-[#00aeef] hover:underline">
                  Password and Account Details
                </Link>
                .
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col gap-4">
                  {loadingUser ? (
                    <div className="text-sm text-gray-500">Loading account information...</div>
                  ) : userError ? (
                    <div className="text-sm text-red-500">{userError}</div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-500">
                          {displayName
                            .split(' ')
                            .map((part) => part.charAt(0))
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <h2 className="text-base font-semibold text-gray-900">{displayName}</h2>
                          <p className="text-sm text-gray-500">{locationText}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Email: <span className="text-gray-900">{userInfo?.email || '—'}</span></p>
                        <p>Phone: <span className="text-gray-900">{userInfo?.phone || '—'}</span></p>
                        {userInfo?.created_at && (
                          <p>
                            Member Since:{' '}
                            <span className="text-gray-900">
                              {new Date(userInfo.created_at).toLocaleDateString()}
                            </span>
                          </p>
                        )}
                      </div>
                      <button className="self-start px-4 py-2 border border-[#00aeef] text-[#00aeef] rounded-md text-sm font-semibold hover:bg-[#00aeef] hover:text-white transition flex items-center gap-2">
                        <FiEdit2 /> Edit Account
                      </button>
                    </>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col gap-4">
                  {loadingUser ? (
                    <div className="text-sm text-gray-500">Loading billing address...</div>
                  ) : userError ? (
                    <div className="text-sm text-red-500">{userError}</div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#00aeef]">
                          <FiMapPin />
                        </div>
                        <div>
                          <h2 className="text-base font-semibold text-gray-900">Billing Address</h2>
                          <p className="text-sm text-gray-500">{displayName}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>{billingAddress}</p>
                        <p>Phone Number: <span className="text-gray-900">{userInfo?.phone || '—'}</span></p>
                        <p>Email: <span className="text-gray-900">{userInfo?.email || '—'}</span></p>
                      </div>
                      <button className="self-start px-4 py-2 border border-[#00aeef] text-[#00aeef] rounded-md text-sm font-semibold hover:bg-[#00aeef] hover:text-white transition flex items-center gap-2">
                        <FiEdit2 /> Edit Address
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-rows-3 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-lg shadow-sm border border-gray-200 flex flex-col justify-center px-4 py-5 ${stat.color}`}
                  >
                    <span className="text-xs uppercase tracking-wide">{stat.label}</span>
                <span className="text-2xl font-bold">{stat.value.toLocaleString('en-PK')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Option</h3>
                <Link href="#" className="text-[#00aeef] text-sm font-semibold flex items-center gap-2">
                  Add Card <FiChevronRight />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentCards.map((card) => (
                  <div
                    key={card.mask}
                    className={`${card.color} text-white rounded-xl p-5 relative shadow-lg overflow-hidden`}
                  >
                    <button className="absolute top-4 right-4 text-white/80 hover:text-white transition">
                      <FaEllipsisH />
                    </button>
                    <div className="text-sm uppercase tracking-wide mb-4 opacity-80">Card Number</div>
                    <div className="text-xl font-semibold mb-6">{card.mask}</div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="opacity-80">Name on card</p>
                        <p className="font-semibold text-base">{card.holder}</p>
                      </div>
                      <div className="text-right">
                        <p className="opacity-80 uppercase text-xs">Type</p>
                        <p className="font-semibold text-base">{card.brand}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Order</h3>
                <Link href="#" className="text-sm text-[#00aeef] font-semibold flex items-center gap-1">
                  View All <FiChevronRight />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">Order ID</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Total</th>
                      <th className="px-6 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-sm text-gray-500">
                          Loading recent orders...
                        </td>
                      </tr>
                    ) : ordersError ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-sm text-red-500">
                          {ordersError}
                        </td>
                      </tr>
                    ) : recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-sm text-gray-500">
                          No orders found yet.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order, index) => {
                        const statusColor =
                          order.status === 'IN PROGRESS'
                            ? 'text-amber-500'
                            : order.status === 'COMPLETED'
                            ? 'text-green-500'
                            : order.status === 'CANCELED'
                            ? 'text-red-500'
                            : 'text-blue-500';
                        return (
                          <tr
                            key={order.id}
                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          >
                            <td className="px-6 py-3 font-medium text-gray-900">{order.id}</td>
                            <td className={`px-6 py-3 font-semibold ${statusColor}`}>{order.status}</td>
                            <td className="px-6 py-3">{order.date}</td>
                            <td className="px-6 py-3 text-gray-900 font-medium">{order.total}</td>
                            <td className="px-6 py-3">
                              <Link
                                href="#"
                                className="text-[#00aeef] font-semibold flex items-center gap-1"
                              >
                                View Details <FiChevronRight className="text-xs" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Browsing History</h3>
                <Link href="#" className="text-sm text-[#00aeef] font-semibold flex items-center gap-1">
                  View All <FiChevronRight />
                </Link>
              </div>
              <div className="px-5 py-5">
                {ordersLoading ? (
                  <div className="py-10 text-sm text-gray-500 text-center">
                    Loading browsing history...
                  </div>
                ) : browsingHistory.length === 0 ? (
                  <div className="py-10 text-sm text-gray-500 text-center">
                    No recently viewed products yet.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {browsingHistory
                        .slice(historyPage * itemsPerHistoryPage, historyPage * itemsPerHistoryPage + itemsPerHistoryPage)
                        .map((item, index) => (
                        <div
                          key={`${item.title}-${historyPage * itemsPerHistoryPage + index}`}
                          className="border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-3 hover:shadow-lg transition"
                        >
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-32 object-contain"
                            />
                            {item.badge && (
                              <span
                                className={`absolute top-2 left-2 text-xs font-semibold text-white px-2 py-1 rounded ${item.badge.color}`}
                              >
                                {item.badge.text}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-yellow-500">
                            {'★★★★★'.split('').map((star, starIndex) => (
                              <span key={starIndex}>
                                {starIndex < Math.round(item.rating) ? '★' : '☆'}
                              </span>
                            ))}
                            <span className="text-gray-500 ml-2">({item.reviews})</span>
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900 leading-snug min-h-12">
                            {item.title}
                          </h4>
                          <div className="text-[#00aeef] font-semibold">{item.price}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-2">
                      {Array.from({ length: totalHistoryPages }).map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setHistoryPage(index)}
                          className={`w-2.5 h-2.5 rounded-full transition ${
                            index === historyPage ? 'bg-[#00aeef]' : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to page ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;

