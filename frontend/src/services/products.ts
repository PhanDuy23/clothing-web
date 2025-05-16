import axios from "axios";
import { ProductDetail, ResponseError } from "../type";

const api = axios.create({
    baseURL: "http://localhost:5000/products",
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
    },
})

export const getProductDetail = async (slug: string): Promise<ProductDetail| null> => {
    try {
        const response = await api.get<ProductDetail>(`/detail/${slug}`);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", error);
        return null;
    }
};

export const getProductsByCategory = async (categoryId: number, limit:number, page:number, status: number,  priceRange?: [number, number]) => {
    try{
        if(!priceRange){
            priceRange = [0, 30000000]
        }
        status = status ?? 1;
        const {data} = await api.get(`?`,{
            params:{
                categoryId,
                limit,
                page,
                status,
                maxPrice: priceRange[1],
                minPrice: priceRange[0]
            }
        })
        
        return data;
      
        
         
    }catch(err){
        console.error("Lỗi khi getProductsByCategory:", err);
        return null
    }
}

export const getProductsDiscount = async ({page, limit}) => {
    try{
        const {data} = await api.get(`discount?&limit=${limit}&page=${page}`)
        return data;
         
    }catch(err){
        console.error("Lỗi khi getProductsdiscount:", err);
        return []
    }
}

export const getProductsQuantity = async (productId: number) => {
    try{
        const {quantity} = await api.get(`/quantity/${productId}`)
        return quantity;
         
    }catch(err){
        console.error("Lỗi khi getProductsQuantity:", err);
        return null
    }
}

export const getTotalProducts = async () => {
    try {
        const response = await api.get<{ totalProducts: number }>('/count');
        return { total: response.data.totalProducts, status: 200 };
    } catch (error: any) {
        console.error("❌ Lỗi khi lấy tổng sản phẩm:", error);
        return { total: 0, status: error.response?.status || 500, message: error.response?.data?.error || "Lỗi server" };
    }
};

export const uploadMultipleImages = async (images, folder) => { 
    try {
        const formData = new FormData();

        // Append folder name
        formData.append("folder", folder);

        // Append all images
        images.forEach((file) => {
            formData.append("images", file);
        });
        

        const response = await axios.post(
            "http://localhost:5000/cld/upload/image",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
                }
            }
        );

        return response.data.urls; // Trả về mảng URL ảnh
    } catch (error) {
        console.error("Upload ảnh thất bại:", error.response.data);
        return  null
        
    }
};

export const addProduct = async (productData, images) => {

    try {

        const imageUrls = await uploadMultipleImages(images, "products")
        productData.imageUrls = imageUrls
        const response = await api.post("/", productData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data
    } catch (error) {
        console.error("❌ Lỗi khi tạo sản phẩm:", error.response?.data || error.message);
        return error.response.data
    }
};

export async function updateProduct(id: number, data: any) {
  try {
    if(data.images?.length){
        const imageUrlsNew = await uploadMultipleImages(data.images, "products")
        data.images = [...imageUrlsNew]
        
    }
    const response = await api.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    return error.response.data
  }
}