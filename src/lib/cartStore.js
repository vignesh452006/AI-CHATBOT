import { useState, useEffect, useCallback } from 'react';

const CART_KEY = 'foodapp_cart';
const FAVS_KEY = 'foodapp_favorites';

let listeners = [];

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch { return []; }
}

function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  listeners.forEach(fn => fn(cart));
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]');
  } catch { return []; }
}

function setFavorites(favs) {
  localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
  listeners.forEach(fn => fn());
}

export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(c => c.name === item.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  setCart(cart);
}

export function removeFromCart(name) {
  const cart = getCart().filter(c => c.name !== name);
  setCart(cart);
}

export function updateQuantity(name, quantity) {
  const cart = getCart();
  const item = cart.find(c => c.name === name);
  if (item) {
    item.quantity = Math.max(0, quantity);
    if (item.quantity === 0) {
      setCart(cart.filter(c => c.name !== name));
    } else {
      setCart(cart);
    }
  }
}

export function clearCart() {
  setCart([]);
}

export function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function toggleFavorite(name) {
  const favs = getFavorites();
  if (favs.includes(name)) {
    setFavorites(favs.filter(f => f !== name));
  } else {
    setFavorites([...favs, name]);
  }
}

export function isFavorite(name) {
  return getFavorites().includes(name);
}

export function getFavoritesList() {
  return getFavorites();
}

export function useCart() {
  const [cart, setCartState] = useState(getCart());
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => {
      setCartState(getCart());
      setTick(t => t + 1);
    };
    listeners.push(handler);
    return () => { listeners = listeners.filter(l => l !== handler); };
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    count: cart.reduce((sum, item) => sum + item.quantity, 0),
    toggleFavorite,
    isFavorite,
    getFavoritesList
  };
}