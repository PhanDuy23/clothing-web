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
    { name: "order-items" } // Key lưu trong localStorage
  )
);

export default useOrder;
