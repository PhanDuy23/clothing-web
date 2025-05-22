import axios from "axios";
import { Category } from "../type";
import { uploadMultipleImages } from "./products";


const api = axios.create({
  baseURL: "http://localhost:5000/categories",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
  },
});


export async function getCategories(req? : any) {
  try {
    const response = await api.get("/",{
      params: req
    })
    console.log("get categories ",response.data);
    
    return response.data
  } catch (error) {
    console.error("Lỗi khi getAllCategories:", error);
    return {message: error.response.data.error}
  }
}

export const buildCategoryTree = (categories : Category) => {
  const map = {};
  const roots : Category[] = [];

  // Tạo map id -> category và khởi tạo child là []
  categories.forEach(cat  => {
    map[cat.id] = { ...cat, child: [] };
  });

  // Gắn category con vào đúng category cha
  categories.forEach(cat => {
    if (cat.parentId) {
      map[cat.parentId]?.child.push(map[cat.id]);
    } else {
      roots.push(map[cat.id]);
    }
  });

  return roots;
}

export async function addCategory(data: any) {
  try {
    // Upload ảnh trước và đảm bảo upload thành công
    const uploadedImages = await uploadMultipleImages([data.image], "categories");

    if (!uploadedImages || uploadedImages.length === 0) {
      throw new Error("Tải ảnh thất bại");
    }

    // Chỉ gán ảnh khi upload thành công
    const categoryData = {
      ...data,
      image: uploadedImages[0],
    };

    const response = await api.post("/", categoryData);
    console.log("create category", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi tạo danh mục:", error);
    return error?.response?.data || { success: false, message: "Có lỗi xảy ra." };
  }
}


export async function updateCategory(id: number, data: any) {
  try {
    const response = await api.put(`/${id}`, data);
    console.log("update category", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    return error.response.data
  }
}


