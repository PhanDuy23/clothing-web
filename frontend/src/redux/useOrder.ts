import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OrderItemType } from "../type";// Import OrderItemType

// Định nghĩa state cho Order Item
interface OrderItemState {
  orderItems: OrderItemType[];
  setOrder: (items: OrderItemType[]) => void;
}

// Tạo store Zustand với persist (lưu vào localStorage)
const useOrder = create<OrderItemState>()(
  persist(
    (set) => ({
      orderItems: [],
      // Hàm setOrder để thiết lập mảng item vào giỏ hàng
      setOrder: (items) => set({ orderItems: items }),
    }),
    { name: "order-items",
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

export default useOrder;
