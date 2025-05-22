
export interface Response {
    success: boolean;
    message: string;
    data: any
}

export interface Category {
    id: number
    name: string
    slug: string
    image: string
    parentId: number
    description: string
    child: Category[]
}

export interface Banner {
    id: number
    title: string
    slug: string
    image: string
}

export interface Product {
    id: number,
    name: string,
    slug: string,
    thumbnail: string,
    colors: string,
    sizes: string,
    price: number,
    originalPrice: number,
    discount: number,
    shortDescription: string
    status: number
    created_at: string
}

export interface ProductDetail {
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: number;
    originalPrice: number;
    cost: number;
    thumbnail: string;
    images: []
    colors: []
    sizes: []
    detailDescription: string;
    shortDescription: string;
    weight: number;
    status: string;
    categoryId: number
    attributes: []
}


export interface Employee {
  id: number
  fullName: string
  phone: string
  role: string
  created_at: Date
  status: number
  email: string
}

export interface PaginationType {
    currentPage: number;
    totalPages: number;
    totalItems: number;
};

export interface OrderItemType {
    id?: number,
    userId?: number,
    image: string,
    productId: number,
    name: string,
    size: string,
    color: string,
    quantity: number,
    price: number,

}

export interface OrderType {
    id: String
    userId: number;
    address: string,
    provinceName: string;
    districtName: string;
    wardName: string;
    note?: string; // Ghi chú có thể không bắt buộc
    paymentMethod: string;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    shippingFee: number;
    discount: number;
    total: number;
    status: string; // Bạn có thể thay đổi thành enum nếu có giá trị cố định
    items: OrderItemType[]
    created_at: Date
}

export interface UserType {
    id: number;
    fullName: string;
    userName?: string;
    email: string;
    password?: string;
    address?: string | null;
    phone?: string | null;
    role?: string;
    avatar?: string | null;
    status?: number;
    created_at?: string;
    updated_at?: string;
}
