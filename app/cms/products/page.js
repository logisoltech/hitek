'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiBox,
  FiPrinter,
  FiMonitor,
  FiTrendingUp,
  FiRefreshCw,
  FiSearch,
  FiAlertTriangle,
  FiArrowLeft,
} from 'react-icons/fi';

const parseNumeric = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'number') return Number.isNaN(value) ? fallback : value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.-]/g, '');
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

const extractImageArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value.imageUrls)) return value.imageUrls.filter((url) => typeof url === 'string' && url.trim() !== '');
  if (Array.isArray(value.image_urls)) return value.image_urls.filter((url) => typeof url === 'string' && url.trim() !== '');
  if (Array.isArray(value.images)) return value.images.filter((url) => typeof url === 'string' && url.trim() !== '');
  if (Array.isArray(value.imageurls)) return value.imageurls.filter((url) => typeof url === 'string' && url.trim() !== '');
  if (typeof value.image === 'string' && value.image.trim() !== '') return [value.image.trim()];
  return [];
};

const sanitizeProduct = (item, type) => {
  if (!item) return null;
  const resolvedType = type || item.type || 'laptop';
  const images = extractImageArray(item);
  const image = images[0] || item.image || (resolvedType === 'printer' ? '/printer-category.png' : '/laptop-category.jpg');
  const price = parseNumeric(item.price, 0);
  return {
    ...item,
    id: item.id?.toString?.() ?? item.id,
    type: resolvedType,
    name:
      item.name ||
      (resolvedType === 'printer'
        ? [item.brand, item.series].filter(Boolean).join(' ')
        : [item.brand, item.model || item.series].filter(Boolean).join(' ')) ||
      'Untitled Product',
    brand: item.brand || 'Unknown',
    description:
      item.description ||
      (resolvedType === 'printer'
        ? [item.resolution, item.copyfeature, item.scanfeature, item.duplex].filter(Boolean).join(' • ')
        : item.processor || item.graphics || 'No description provided.'),
    price,
    priceLabel: price > 0 ? `PKR ${price.toLocaleString('en-PK')}` : 'Price on request',
    image,
    images,
    category: resolvedType === 'printer' ? 'Printers' : 'Laptops',
    stock: parseNumeric(item.stock, 10),
    rating: parseNumeric(item.rating, 4.7),
    reviews: parseNumeric(item.reviews, 0),
  };
};

const renderProductImage = (src, alt) => {
  if (src?.startsWith?.('http')) {
    return (
      <img
        src={src}
        alt={alt}
        className="h-28 w-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
    );
  }
  return (
    <img
      src={src || '/laptop-category.jpg'}
      alt={alt}
      className="h-28 w-full object-contain transition-transform duration-300 group-hover:scale-105"
    />
  );
};

const CmsProductsPage = () => {
  const router = useRouter();
  const [cmsUser, setCmsUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedUser = window.localStorage.getItem('cmsUser');
    const storedSession = window.localStorage.getItem('cmsSession');

    if (!storedUser || !storedSession) {
      router.replace('/cms/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setCmsUser(parsedUser);
    } catch (err) {
      console.error('Failed to parse CMS user', err);
      router.replace('/cms/auth/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const [laptopsRes, printersRes] = await Promise.all([
          fetch('http://localhost:3001/api/laptops'),
          fetch('http://localhost:3001/api/printers'),
        ]);

        if (!laptopsRes.ok) throw new Error('Failed to load laptops');
        if (!printersRes.ok) throw new Error('Failed to load printers');

        const [laptopsData, printersData] = await Promise.all([laptopsRes.json(), printersRes.json()]);

        const sanitized = [
          ...(Array.isArray(laptopsData) ? laptopsData.map((item) => sanitizeProduct(item, 'laptop')) : []),
          ...(Array.isArray(printersData) ? printersData.map((item) => sanitizeProduct(item, 'printer')) : []),
        ].filter(Boolean);

        setProducts(sanitized);
      } catch (err) {
        console.error('CMS products fetch error:', err);
        setError(err.message || 'Failed to load products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesFilter = filter === 'all' ? true : product.type === filter;
      const matchesSearch = searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesFilter && matchesSearch;
    });
  }, [products, filter, searchTerm]);

  const stats = useMemo(() => {
    const total = products.length;
    const laptops = products.filter((product) => product.type === 'laptop').length;
    const printers = products.filter((product) => product.type === 'printer').length;
    const averagePrice =
      products.length > 0
        ? products.reduce((sum, product) => sum + (Number.isFinite(product.price) ? product.price : 0), 0) /
          products.length
        : 0;

    return {
      total,
      laptops,
      printers,
      averagePrice: Math.round(averagePrice),
    };
  }, [products]);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),transparent_55%)] opacity-80 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.35em] uppercase text-slate-300">
              <FiBox className="text-[#38bdf8]" /> Products
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Product Catalogue</h1>
            <p className="mt-1 text-sm text-slate-300">
              Manage every laptop and printer listed on your hi-tech storefront. Update, monitor, and synchronize inventory.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Link
              href="/cms/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/20 rounded-lg text-sm font-semibold text-white hover:bg-white/10 transition shadow-lg shadow-black/10"
            >
              <FiArrowLeft />
              Back to dashboard
            </Link>
            <button
              onClick={() => router.refresh()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#38bdf8] to-[#6366f1] hover:from-[#0ea5e9] hover:to-[#4338ca] text-white text-sm font-semibold rounded-lg transition shadow-lg shadow-[#6366f1]/30"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-white/10 bg-linear-to-br from-[#38bdf8] to-[#6366f1] p-6 shadow-xl">
            <p className="text-xs uppercase tracking-wide text-white/80">Total Products</p>
            <p className="mt-3 text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-white/70 mt-1">Active listings across all categories</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">Laptops</p>
                <p className="mt-3 text-2xl font-semibold text-white">{stats.laptops}</p>
              </div>
              <span className="h-11 w-11 rounded-full bg-linear-to-br from-[#38bdf8]/30 to-[#38bdf8]/10 flex items-center justify-center text-[#38bdf8]">
                <FiMonitor />
              </span>
            </div>
            <p className="text-xs text-white/60 mt-2">Devices sourced from Supabase laptops table</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">Printers</p>
                <p className="mt-3 text-2xl font-semibold text-white">{stats.printers}</p>
              </div>
              <span className="h-11 w-11 rounded-full bg-linear-to-br from-[#f97316]/30 to-[#fb7185]/10 flex items-center justify-center text-[#fb7185]">
                <FiPrinter />
              </span>
            </div>
            <p className="text-xs text-white/60 mt-2">Entries from the Supabase printers table</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">Average Price</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {stats.averagePrice > 0 ? `PKR ${stats.averagePrice.toLocaleString('en-PK')}` : 'n/a'}
                </p>
              </div>
              <span className="h-11 w-11 rounded-full bg-linear-to-br from-[#22c55e]/30 to-[#16a34a]/10 flex items-center justify-center text-[#22c55e]">
                <FiTrendingUp />
              </span>
            </div>
            <p className="text-xs text-white/60 mt-2">Median pricing across current catalogue</p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-3xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-xl px-4 py-3">
              <FiSearch className="text-slate-300" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or brand..."
                className="bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  filter === 'all'
                    ? 'bg-linear-to-r from-[#38bdf8] to-[#6366f1] text-white shadow-lg shadow-[#6366f1]/30'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setFilter('laptop')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  filter === 'laptop'
                    ? 'bg-linear-to-r from-[#38bdf8] to-[#6366f1] text-white shadow-lg shadow-[#6366f1]/30'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                Laptops
              </button>
              <button
                onClick={() => setFilter('printer')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  filter === 'printer'
                    ? 'bg-linear-to-r from-[#38bdf8] to-[#6366f1] text-white shadow-lg shadow-[#6366f1]/30'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                Printers
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {loading && (
              <div className="col-span-full flex flex-col items-center justify-center gap-3 py-20 text-slate-200">
                <FiRefreshCw className="animate-spin text-2xl" />
                <p className="text-sm">Loading product catalogue...</p>
              </div>
            )}

            {error && !loading && (
              <div className="col-span-full border border-red-400/30 bg-red-500/10 text-red-100 rounded-2xl p-6 flex gap-3 items-start">
                <FiAlertTriangle className="mt-1 text-xl" />
                <div>
                  <p className="text-sm font-semibold">Unable to load products</p>
                  <p className="text-xs mt-1">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="col-span-full border border-white/10 bg-white/5 text-white/80 rounded-2xl p-6">
                <p className="text-sm font-semibold">No products match your filters.</p>
                <p className="text-xs mt-1">Try adjusting your search or product type selection.</p>
              </div>
            )}

            {!loading &&
              !error &&
              filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-white/5 opacity-60 pointer-events-none" />
                  <div className="relative p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
                        {product.type === 'printer' ? <FiPrinter /> : <FiMonitor />}
                        {product.category}
                      </span>
                      <span className="text-xs text-white/60">{product.brand}</span>
                    </div>

                    <div className="flex items-center justify-center bg-white/5 border border-white/10 rounded-xl p-4 h-36">
                      {renderProductImage(product.image, product.name)}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-white line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-white/70 line-clamp-3 min-h-[48px]">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-white/80">
                      <span className="font-semibold text-white">{product.priceLabel}</span>
                      <span>{product.stock} in stock</span>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CmsProductsPage;

