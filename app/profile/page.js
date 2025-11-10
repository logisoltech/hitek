'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FaRegUser, FaClipboardList, FaTruck, FaShoppingCart, FaRegHeart, FaAddressCard, FaHistory, FaCog, FaSignOutAlt, FaEllipsisH } from 'react-icons/fa';
import { FiChevronRight, FiMapPin, FiPhone, FiMail, FiEdit2, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import Navbar from '../Cx/Layout/Navbar';
import Footer from '../Cx/Layout/Footer';
import { openSans } from '../Cx/Font/font';
import { useCart } from '../Cx/Providers/CartProvider';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [historyPage, setHistoryPage] = useState(0);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { cartItems, cartSubtotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cvc: '',
    expiry: '',
    provider: 'Visa',
  });
  const [cardFormMessage, setCardFormMessage] = useState('');
  const [orderHistoryPage, setOrderHistoryPage] = useState(0);
  const ORDER_HISTORY_PAGE_SIZE = 5;

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
    { label: 'Dashboard', icon: <FaRegUser /> },
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

  const formatCurrency = (value) =>
    `PKR ${Number(value || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;

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

  const formattedOrders = useMemo(() => {
    return orders.map((order) => {
      const itemCount = order.order_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      return {
        id: `#${order.id}`,
        status: order.status?.toUpperCase?.() || 'PENDING',
        date: order.created_at ? new Date(order.created_at).toLocaleString() : '—',
        total: `PKR ${Number(order.total || 0).toLocaleString('en-PK')} (${itemCount} Products)`,
      };
    });
  }, [orders]);

  const recentOrders = useMemo(() => {
    return formattedOrders.slice(0, 7);
  }, [formattedOrders]);

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

  const cartItemsDetailed = useMemo(() => {
    return cartItems.map((item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 0) || 1;
      const safePrice = Number.isFinite(price) ? price : 0;
      const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
      return {
        ...item,
        displayName: item.name || item.title || 'Product',
        image: item.image || item.thumbnail || '/laptop-category.jpg',
        price: safePrice,
        quantity: safeQuantity,
        lineTotal: safePrice * safeQuantity,
      };
    });
  }, [cartItems]);

  const cartIsEmpty = cartItemsDetailed.length === 0;
  const formattedCartSubtotal = useMemo(() => formatCurrency(cartSubtotal), [cartSubtotal]);

  const paymentProviders = ['Visa', 'Mastercard', 'Easypaisa', 'Nayapay', 'Sadapay'];

  const userAddresses = useMemo(() => {
    if (!userInfo) return [];
    const addresses = [];

    const shippingLines = [userInfo.shipment_address, userInfo.city, userInfo.province]
      .filter(Boolean)
      .map((line) => line.trim());
    if (shippingLines.length) {
      addresses.push({
        label: 'Shipping Address',
        lines: shippingLines,
        phone: userInfo.phone,
        email: userInfo.email,
      });
    }

    const billingLines = [userInfo.address, userInfo.city, userInfo.province]
      .filter(Boolean)
      .map((line) => line.trim());
    if (billingLines.length) {
      addresses.push({
        label: 'Billing Address',
        lines: billingLines,
        phone: userInfo.phone,
        email: userInfo.email,
      });
    }

    if (addresses.length === 0) {
      addresses.push({
        label: 'No Addresses Found',
        lines: ['Add your address information to manage deliveries easily.'],
        phone: userInfo.phone,
        email: userInfo.email,
      });
    }

    return addresses;
  }, [userInfo]);

  const handleDecreaseQuantity = (id, currentQuantity) => {
    const numericQuantity = Number(currentQuantity);
    const safeCurrent = Number.isFinite(numericQuantity) && numericQuantity > 0 ? numericQuantity : 1;
    const nextQuantity = Math.max(1, safeCurrent - 1);
    updateQuantity(id, nextQuantity);
  };

  const handleIncreaseQuantity = (id, currentQuantity) => {
    const numericQuantity = Number(currentQuantity);
    const safeCurrent = Number.isFinite(numericQuantity) && numericQuantity > 0 ? numericQuantity : 1;
    const nextQuantity = safeCurrent + 1;
    updateQuantity(id, nextQuantity);
  };

  const handleCardFormChange = (event) => {
    const { name, value } = event.target;
    setCardForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCardFormMessage('');
  };

  const handleCardFormSubmit = (event) => {
    event.preventDefault();
    setCardFormMessage('Card saving feature is coming soon. Your details were captured locally.');
  };

  useEffect(() => {
    const totalOrderPages = Math.max(
      1,
      Math.ceil(formattedOrders.length / ORDER_HISTORY_PAGE_SIZE),
    );
    if (orderHistoryPage > totalOrderPages - 1) {
      setOrderHistoryPage(Math.max(0, totalOrderPages - 1));
    }
  }, [formattedOrders.length, orderHistoryPage, ORDER_HISTORY_PAGE_SIZE]);

  useEffect(() => {
    if (activeTab === 'Order History') {
      setOrderHistoryPage(0);
    }
  }, [activeTab]);

  useEffect(() => {
    if (historyPage > totalHistoryPages - 1) {
      setHistoryPage(Math.max(0, totalHistoryPages - 1));
    }
  }, [historyPage, totalHistoryPages]);

  const renderOrderHistorySection = ({
    title = 'Recent Order',
    showViewAll = true,
    rows,
    paginate = false,
  } = {}) => {
    const rowsToRender = Array.isArray(rows) ? rows : recentOrders;
    const totalPages = paginate
      ? Math.max(1, Math.ceil(rowsToRender.length / ORDER_HISTORY_PAGE_SIZE))
      : 1;
    const currentPage = paginate
      ? Math.min(orderHistoryPage, totalPages - 1)
      : 0;
    const startIndex = currentPage * ORDER_HISTORY_PAGE_SIZE;
    const visibleRows = paginate
      ? rowsToRender.slice(startIndex, startIndex + ORDER_HISTORY_PAGE_SIZE)
      : rowsToRender.slice(0, ORDER_HISTORY_PAGE_SIZE);

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {showViewAll && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('Order History');
                setOrderHistoryPage(0);
              }}
              className="text-sm text-[#00aeef] font-semibold flex items-center gap-1 hover:underline"
            >
              View All <FiChevronRight />
            </button>
          )}
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
                    Loading orders...
                  </td>
                </tr>
              ) : ordersError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm text-red-500">
                    {ordersError}
                  </td>
                </tr>
              ) : rowsToRender.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm text-gray-500">
                    No orders found yet.
                  </td>
                </tr>
              ) : (
                visibleRows.map((order, index) => {
                  const statusColor =
                    order.status === 'IN PROGRESS'
                      ? 'text-amber-500'
                      : order.status === 'COMPLETED'
                      ? 'text-green-500'
                      : order.status === 'CANCELED'
                      ? 'text-red-500'
                      : 'text-blue-500';
                  return (
                    <tr key={`${order.id}-${startIndex + index}`} className={(startIndex + index) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-3 font-medium text-gray-900">{order.id}</td>
                      <td className={`px-6 py-3 font-semibold ${statusColor}`}>{order.status}</td>
                      <td className="px-6 py-3">{order.date}</td>
                      <td className="px-6 py-3 text-gray-900 font-medium">{order.total}</td>
                      <td className="px-6 py-3">
                        <Link href="#" className="text-[#00aeef] font-semibold flex items-center gap-1">
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
        {paginate && rowsToRender.length > ORDER_HISTORY_PAGE_SIZE && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setOrderHistoryPage(Math.max(0, currentPage - 1))}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-md border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <div className="flex items-center gap-2 justify-center">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setOrderHistoryPage(index)}
                  className={`w-8 h-8 rounded-md text-sm font-semibold ${
                    index === currentPage
                      ? 'bg-[#00aeef] text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setOrderHistoryPage(Math.min(totalPages - 1, currentPage + 1))
              }
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-md border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderBrowsingHistorySection = ({
    title = 'Browsing History',
    showViewAll = true,
  } = {}) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        
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
                .slice(
                  historyPage * itemsPerHistoryPage,
                  historyPage * itemsPerHistoryPage + itemsPerHistoryPage,
                )
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
  );

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
              {navigationItems.map((item) => {
                const isActive = activeTab === item.label;
                const isLogout = item.label === 'Log out';
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => {
                        if (isLogout) {
                          if (typeof window !== 'undefined') {
                            window.localStorage.removeItem('user');
                            window.location.href = '/';
                          }
                          return;
                        }
                        setActiveTab(item.label);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition ${
                        isActive
                          ? 'bg-[#00aeef] text-white shadow'
                          : isLogout
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="flex-1 text-left">{item.label}</span>
                      {!isActive && !isLogout && <FiChevronRight className="text-xs text-gray-400" />}
                    </button>
                  </li>
                );
              })}
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

            {activeTab === 'Dashboard' && (
              <>
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

                {renderOrderHistorySection({ title: 'Recent Order', showViewAll: true, rows: recentOrders })}

                {renderBrowsingHistorySection()}
              </>
            )}

            {activeTab === 'Order History' && (
              <>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                  <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Review your past purchases and keep track of their status in one place.
                  </p>
                </div>
                {renderOrderHistorySection({
                  title: 'Order History',
                  showViewAll: false,
                  rows: formattedOrders,
                  paginate: true,
                })}
              </>
            )}

            {activeTab === 'Shopping Cart' && (
              <>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
                      <p className="mt-1 text-sm text-gray-600">
                        {cartIsEmpty
                          ? 'Your cart is currently empty. Add products to see them listed here.'
                          : `You have ${cartCount} ${cartCount === 1 ? 'item' : 'items'} ready for checkout.`}
                      </p>
                    </div>
                    {!cartIsEmpty && (
                      <button
                        type="button"
                        onClick={clearCart}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold transition"
                      >
                        <FiTrash2 /> Clear Cart
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                  {cartIsEmpty ? (
                    <div className="py-16 text-center text-sm text-gray-500">
                      Your cart is empty right now. Explore our{' '}
                      <Link href="/all-products" className="text-[#00aeef] font-semibold hover:underline">
                        latest products
                      </Link>{' '}
                      to find something you like.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cartItemsDetailed.map((item) => (
                        <div
                          key={item.id ?? item.displayName}
                          className="flex flex-col md:flex-row gap-4 border border-gray-100 rounded-lg p-4"
                        >
                          <div className="w-full md:w-28 h-28 shrink-0 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.displayName}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-2">
                              <h4 className="text-base font-semibold text-gray-900">{item.displayName}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-600 max-w-xl">{item.description}</p>
                              )}
                              <div className="text-sm text-gray-600">
                                Unit Price:{' '}
                                <span className="text-gray-900 font-semibold">{formatCurrency(item.price)}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Line Total:{' '}
                                <span className="text-gray-900 font-semibold">{formatCurrency(item.lineTotal)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="inline-flex items-center border border-gray-200 rounded-md overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                                  className="px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <FiMinus />
                                </button>
                                <span className="w-12 text-center text-sm font-semibold text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                                  className="px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                                  aria-label="Increase quantity"
                                >
                                  <FiPlus />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition"
                                aria-label="Remove item"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-200 pt-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">Subtotal:</span>{' '}
                          {formattedCartSubtotal}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Link
                            href="/cart"
                            className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-[#00aeef] text-[#00aeef] hover:bg-[#00aeef] hover:text-white text-sm font-semibold transition"
                          >
                            View Full Cart
                          </Link>
                          <Link
                            href="/checkout"
                            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#00aeef] text-white hover:bg-[#0099d9] text-sm font-semibold transition"
                          >
                            Proceed to Checkout
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'Browsing History' && (
              <>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                  <h2 className="text-lg font-semibold text-gray-900">Browsing History</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Review the products you recently viewed to quickly get back to items of interest.
                  </p>
                </div>
                {renderBrowsingHistorySection({
                  title: 'Recently Viewed Products',
                  showViewAll: false,
                })}
              </>
            )}

            {activeTab === 'Cards & Address' && (
              <>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                  <h2 className="text-lg font-semibold text-gray-900">Cards &amp; Address</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Manage your saved payment methods and delivery locations to speed up future checkouts.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
                      
                    </div>
                    {loadingUser ? (
                      <div className="text-sm text-gray-500">Loading addresses...</div>
                    ) : userError ? (
                      <div className="text-sm text-red-500">{userError}</div>
                    ) : (
                      <div className="space-y-4">
                        {userAddresses.map((address, index) => (
                          <div
                            key={`${address.label}-${index}`}
                            className="border border-gray-200 rounded-md p-4 flex flex-col gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#00aeef]">
                                <FiMapPin />
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900">{address.label}</h4>
                                <p className="text-xs text-gray-500">
                                  Last updated {userInfo?.updated_at ? new Date(userInfo.updated_at).toLocaleDateString() : 'recently'}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              {address.lines.map((line, lineIndex) => (
                                <p key={lineIndex}>{line}</p>
                              ))}
                              {address.phone && (
                                <p className="flex items-center gap-2">
                                  <FiPhone className="text-gray-400" /> <span>{address.phone}</span>
                                </p>
                              )}
                              {address.email && (
                                <p className="flex items-center gap-2">
                                  <FiMail className="text-gray-400" /> <span>{address.email}</span>
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                              <button className="px-3 py-1.5 text-xs font-semibold text-[#00aeef] border border-[#00aeef] rounded-md hover:bg-[#00aeef] hover:text-white transition">
                                Edit
                              </button>
                              <button className="px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-md hover:bg-gray-100 transition">
                                Set Default
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 max-w-xl w-full mx-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Add Payment Method</h3>
                    <form className="space-y-3" onSubmit={handleCardFormSubmit}>
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={cardForm.cardNumber}
                          onChange={handleCardFormChange}
                          placeholder="XXXX XXXX XXXX XXXX"
                          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                          inputMode="numeric"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            id="cvc"
                            name="cvc"
                            value={cardForm.cvc}
                            onChange={handleCardFormChange}
                            placeholder="123"
                            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                            inputMode="numeric"
                          />
                        </div>
                        <div>
                          <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiry"
                            name="expiry"
                            value={cardForm.expiry}
                            onChange={handleCardFormChange}
                            placeholder="MM/YY"
                            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                          Service Provider
                        </label>
                        <select
                          id="provider"
                          name="provider"
                          value={cardForm.provider}
                          onChange={handleCardFormChange}
                          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        >
                          {paymentProviders.map((provider) => (
                            <option key={provider} value={provider}>
                              {provider}
                            </option>
                          ))}
                        </select>
                      </div>

                      {cardFormMessage && (
                        <div className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-md px-3 py-2">
                          {cardFormMessage}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#00aeef] text-white hover:bg-[#0099d9] text-sm font-semibold transition"
                        >
                          Save Card
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCardForm({
                              cardNumber: '',
                              cvc: '',
                              expiry: '',
                              provider: 'Visa',
                            });
                            setCardFormMessage('');
                          }}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-semibold transition"
                        >
                          Clear
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )}

            {activeTab !== 'Dashboard' &&
              activeTab !== 'Order History' &&
              activeTab !== 'Shopping Cart' &&
              activeTab !== 'Browsing History' &&
              activeTab !== 'Cards & Address' && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{activeTab}</h2>
                <p className="text-sm text-gray-600">
                  This section is coming soon. Stay tuned for updates!
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;

