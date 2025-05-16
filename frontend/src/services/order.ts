import axios from "axios"
import { OrderItemType, OrderType, ResponseError } from "../type";

export interface OrderResponse {
  success: boolean;
  message: string;
  orderId: number;
}

const api = axios.create({
  baseURL: "http://localhost:5000/orders",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
  },
})

export const createOrder = async (
  order: OrderType,
  items: OrderItemType[]
): Promise<string | ResponseError> => {
  try {
    console.log(items);

    const response = await api.post('', {
      order,
      items
    });
    return { data: response.data.orderId, success: true };
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error);
    return { success: false, message: error.response.data.message };
  }
};

export const getOrdersByUser = async (userId: number, options: {}) => {
  try {
    const { page = 1, limit = 10, status } = options;
    const { data } = await api.get(`/${userId}`, {
      params: {
        page,
        limit,
        ...(status ? { status } : {}) // Chỉ thêm status nếu có
      },

    });
    console.log(data);

    return {
      success: data.success,
      orders: data.orders,
      pagination: data.pagination
      // {
      //   total,
      //   page,
      //   limit,
      //   totalPages: Math.ceil(total / limit)
      // }
    }
  } catch (error) {
    console.error("Lỗi khi fetch đơn hàng:", error);
    return { success: error.response?.data.success, message: error.response?.data.message }
  }
};

export const getOrders = async (options: {}) => {
  try {
    const { page, limit, status } = options;
    const { data } = await api.get(`/`, {
      params: {
        page,
        limit,
        ...(status ? { status } : {}) // Chỉ thêm status nếu có
      },

    });
    console.log(data);

    return {
      success: data.success,
      orders: data.orders,
      pagination: data.pagination
      // {
      //   total,
      //   page,
      //   limit,
      //   totalPages: Math.ceil(total / limit)
      // }
    }
  } catch (error) {
    console.error("Lỗi khi fetch đơn hàng:", error);
    return { success: error.response?.data.success, message: error.response?.data.message }
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await api.put(`/${orderId}`, {
      status
    });
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    return { success: error.response?.data.success, message: error.response?.data.message }
  }
};

export const getTotalOrdersThisMonth = async () => {
  try {
    const response = await api.get<{ totalOrder: number }>('/count-this-month');
    return { total: response.data.totalOrder, status: 200 };
  } catch (error: any) {
    console.error("❌ Lỗi khi lấy tổng đơn hàng tháng này:", error);
    return { total: 0, status: error.response?.status || 500, message: error.response?.data?.error || "Lỗi server" };
  }
};