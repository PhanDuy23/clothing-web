import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OrderItemType } from "../type";// Import interface từ file types.ts

// Định nghĩa state
interface ShoppingCartState {
  cart: OrderItemType[];
  add: (items: OrderItemType[]) => void;
  setCart: (items: OrderItemType[]) => void;
  remove: (id: number) => void;
  clearCart: () => void;
}

// Tạo Zustand store với persist (lưu vào localStorage)
const useShoppingCart = create<ShoppingCartState>()(
  persist(
    (set) => ({
      cart: [],

      add: (items) =>
        set((state) => ({
          cart: [...state.cart, ...items],
        })),
      setCart: (items) =>
        set(() => ({
          cart: [ ...items],
        })),

      remove: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart",
      partialize: (state) => ({ cart: state.cart }),
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        }
      },
    } // Key lưu trong localStorage
  )
);

export default useShoppingCart;
