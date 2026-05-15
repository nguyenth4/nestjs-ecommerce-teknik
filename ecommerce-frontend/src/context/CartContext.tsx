import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import axios from 'axios';
import { getStoreAuthToken } from '../utils/storeAuth';

const API = 'http://localhost:3000';

export type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
    sku?: string | null;
    category?: { name: string };
    inventory?: { quantity: number } | null;
  };
};

export type Cart = {
  id: string;
  items: CartItem[];
};

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  itemCount: number;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateLineQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeLine: (itemId: string) => Promise<void>;
  clearError: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function authHeader() {
  const t = getStoreAuthToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    const t = getStoreAuthToken();
    if (!t) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get<Cart>(`${API}/cart`, { headers: authHeader() });
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    const handler = () => {
      void refreshCart();
    };
    window.addEventListener('teknik-store-auth', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('teknik-store-auth', handler);
      window.removeEventListener('storage', handler);
    };
  }, [refreshCart]);

  const itemCount = useMemo(
    () => (cart?.items ?? []).reduce((sum, i) => sum + i.quantity, 0),
    [cart],
  );

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      const t = getStoreAuthToken();
      if (!t) {
        const err = new Error('AUTH_REQUIRED');
        throw err;
      }
      setError(null);
      await axios.post(
        `${API}/cart/items`,
        { productId, quantity },
        { headers: authHeader() },
      );
      await refreshCart();
    },
    [refreshCart],
  );

  const updateLineQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      setError(null);
      await axios.patch(
        `${API}/cart/items/${itemId}`,
        { quantity },
        { headers: authHeader() },
      );
      await refreshCart();
    },
    [refreshCart],
  );

  const removeLine = useCallback(
    async (itemId: string) => {
      setError(null);
      await axios.delete(`${API}/cart/items/${itemId}`, { headers: authHeader() });
      await refreshCart();
    },
    [refreshCart],
  );

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      itemCount,
      refreshCart,
      addToCart,
      updateLineQuantity,
      removeLine,
      clearError,
    }),
    [
      cart,
      loading,
      error,
      itemCount,
      refreshCart,
      addToCart,
      updateLineQuantity,
      removeLine,
      clearError,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
