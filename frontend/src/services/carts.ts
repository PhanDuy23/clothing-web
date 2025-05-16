import axios from "axios";
import { OrderItemType } from "../type";

const cartsApi = axios.create({
    baseURL: "http://localhost:5000/carts",
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
    },
})

export interface CartResponse {
    success: boolean;
    message: string;
    data?: OrderItemType[];
  }

export const addToCart = async (
  userId: number,
  items: OrderItemType[]
): Promise<CartResponse | null> => {
  try {
    const response = await cartsApi.post<CartResponse>("", {
      userId,
      items,
    });
    return {success: response.data.success, message: response.data.message}
  } catch (error) {
    console.error("❌ Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    return {success: error.response.data.success, message: error.response.data.message}
  }
};

/**
 * Lấy danh sách sản phẩm trong giỏ hàng
 * @param userId ID của người dùng
 * @returns Danh sách sản phẩm trong giỏ hàng
 */
export const getCartItems = async (userId: number): Promise<CartResponse> => {
  try {
    const response = await cartsApi.get<CartResponse>(`/${userId}`);
    return {success: response.data.success, message: response.data.message, data: response.data.data || []}
  } catch (error) {
    console.error("❌ Lỗi khi lấy giỏ hàng:", error);
    return {success: error.response.data.success, message: error.response.data.message, data: []}
  }
};

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * @param cartItemId ID của item trong giỏ hàng
 * @returns Kết quả xóa
 */
export const removeCartItem = async (cartItemId: number): Promise<CartResponse | null> => {
  try {
    const response = await cartsApi.delete<CartResponse>(`/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    return {success: error.response.data.success, message: error.response.data.message}
  }
};


export const removeAllCartItem = async (userId: number): Promise<CartResponse | null> => {
  try {
    const response = await cartsApi.delete<CartResponse>(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi xóa giỏ hàng:", error);
    return {success: error.response.data.success, message: error.response.data.message}
  }
};

