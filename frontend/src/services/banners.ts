import axios from "axios";
import { uploadMultipleImages } from "./products";

const api = axios.create({
  baseURL: "http://localhost:5000/banners",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
  },
});

export async function getBanners() {
  try {
    const res = await api.get("/")
    console.log("get banners:", res);
    return res.data.data
  } catch (error) {
    console.error("Lỗi khi get banners:", error);
    return null
  }
}

export const createBanner = async (banner) => {
  try {
    const image = await uploadMultipleImages([banner.image], "banners")
    if (image) {
      banner.image = image[0]
      const response = await api.post(`/`, banner);
      return response.data;
    }else{
      return {message: "lỗi khi tạo ảnh"}
    }

  } catch (error) {
    console.error("Lỗi khi tạo banner:", error);
    throw error;
  }
};

// 3. Xóa banner theo id
export const deleteBanner = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa banner:", error);
    throw error;
  }
};