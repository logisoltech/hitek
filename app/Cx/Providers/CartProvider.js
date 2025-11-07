'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'hi-tech-cart-items';

const normalizeId = (id) => {
  if (id === null || id === undefined) {
    return '';
  }
  return id.toString();
};

const parseNumeric = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const cleaned = value.toString().replace(/[^\d.-]/g, '');
  const num = Number(cleaned);
  return Number.isNaN(num) ? fallback : num;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(
            parsed.map((item) => ({
              ...item,
              id: normalizeId(item.id),
              quantity: parseNumeric(item.quantity, 1),
              price: parseNumeric(item.price, 0),
            })),
          );
        }
      }
    } catch (error) {
      console.error('Failed to load cart items from storage:', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart items to storage:', error);
    }
  }, [cartItems]);

  const addToCart = useCallback((rawItem, quantity = 1) => {
    if (!rawItem) return;
    const normalizedId = normalizeId(rawItem.id);
    if (!normalizedId) return;

    const normalizedItem = {
      ...rawItem,
      id: normalizedId,
      price: parseNumeric(rawItem.price, 0),
      quantity: parseNumeric(quantity, 1),
    };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === normalizedId);
      if (existingIndex !== -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + normalizedItem.quantity,
        };
        return updated;
      }
      return [...prev, normalizedItem];
    });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    const normalizedId = normalizeId(id);
    const safeQuantity = Math.max(1, parseNumeric(quantity, 1));

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === normalizedId ? { ...item, quantity: safeQuantity } : item,
      ),
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    const normalizedId = normalizeId(id);
    setCartItems((prev) => prev.filter((item) => item.id !== normalizedId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartSubtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [cartItems, cartCount, cartSubtotal, addToCart, updateQuantity, removeFromCart, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

