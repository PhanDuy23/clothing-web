import axios from "axios"
import { OrderItemType, OrderType, ResponseError } from "../type";

export interface OrderResponse {
  success: boolean;
  message: string;
  orderId: number;
}

const api = axios.create({
  baseURL: "http://localhost:5000/orderItems",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
  },
})

export const getOrderItems = async (orderId:String) => {
  try {
    const { data } = await api.get(`/${orderId}`);
    console.log(data);
    return data
  } catch (error) {
    console.error("Lỗi khi fetch đơn hàng:", error);
    return { success: error.response?.data.success, message: error.response?.data.message }
  }
};
