import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product } from '../data/products';

export interface CartItem {
  key: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface DemoOrder {
  id: string;
  date: string;
  customerName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

interface StoreContextValue {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  wishlist: string[];
  orders: DemoOrder[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isAtelierOpen: boolean;
  quickViewProduct: Product | null;
  announcementVisible: boolean;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsAtelierOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  dismissAnnouncement: () => void;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  placeDemoOrder: (details: {
    customerName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  }) => DemoOrder;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'velora_cart_v1';
const WISHLIST_STORAGE_KEY = 'velora_wishlist_v1';
const ORDERS_STORAGE_KEY = 'velora_orders_v1';
const ANNOUNCEMENT_KEY = 'velora_announcement_dismissed';

export const FREE_SHIPPING_THRESHOLD = 450;
export const STANDARD_SHIPPING_FEE = 28;

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<DemoOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [announcementVisible, setAnnouncementVisible] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ANNOUNCEMENT_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAtelierOpen, setIsAtelierOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore storage quota errors
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore storage quota errors
    }
  }, [orders]);

  const dismissAnnouncement = () => {
    setAnnouncementVisible(false);
    try {
      sessionStorage.setItem(ANNOUNCEMENT_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    const key = `${product.id}__${size}__${color}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { key, product, size, color, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const updateQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(key);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const placeDemoOrder = (details: {
    customerName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  }) => {
    const shipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const order: DemoOrder = {
      id: `VLR-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customerName: details.customerName,
      email: details.email,
      address: details.address,
      city: details.city,
      postalCode: details.postalCode,
      items: [...cart],
      subtotal: cartSubtotal,
      shipping,
      total: cartSubtotal + shipping,
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return order;
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        wishlist,
        orders,
        isCartOpen,
        isSearchOpen,
        isAtelierOpen,
        quickViewProduct,
        announcementVisible,
        setIsCartOpen,
        setIsSearchOpen,
        setIsAtelierOpen,
        setQuickViewProduct,
        dismissAnnouncement,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        placeDemoOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}
