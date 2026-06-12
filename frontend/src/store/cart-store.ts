import { create } from "zustand";
import { cartApi } from "@/lib/api";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    stock: number;
    images: { url: string; alt?: string }[];
  };
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  itemCount: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await cartApi.get();
      const items = cart.items || [];
      set({
        items,
        itemCount: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId: number, quantity: number = 1) => {
    set({ isLoading: true });
    try {
      const cart = await cartApi.addItem(productId, quantity);
      const items = cart.items || [];
      set({
        items,
        itemCount: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateItem: async (itemId: number, quantity: number) => {
    set({ isLoading: true });
    try {
      const cart = await cartApi.updateItem(itemId, quantity);
      const items = cart.items || [];
      set({
        items,
        itemCount: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeItem: async (itemId: number) => {
    set({ isLoading: true });
    try {
      const cart = await cartApi.removeItem(itemId);
      const items = cart.items || [];
      set({
        items,
        itemCount: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await cartApi.clear();
      set({ items: [], itemCount: 0 });
    } catch (error) {
      throw error;
    }
  },

  setItems: (items: CartItem[]) =>
    set({
      items,
      itemCount: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
    }),
}));
