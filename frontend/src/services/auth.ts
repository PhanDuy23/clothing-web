import axios from 'axios';
import { UserType } from '../type';
import { number } from 'zod';
 
// Khởi tạo axios instance
const BACKEND_API = import.meta.env.VITE_BACKEND_API;
const api = axios.create({
    baseURL: BACKEND_API,
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
    },
});

interface RegisterResponse {
    message: string;
    status: number,
    user: UserType;
}

interface LoginResponse {
    message: string;
    user: UserType;
}

// Hàm đăng ký người dùng mới
export const registerUser = async (userData: UserType) => {
    try {
        const { data, status } = await api.post<RegisterResponse>('/register', userData);
        return { user: data.user, status, message: data.message };
    } catch (error) {
        console.error("error.response.data.error")
        return { status: error.status, message: error.response.data.error, user: null }
    }
};

// Hàm đăng nhập
export const loginUser = async ({ userName, password }: { userName: string, password: string }) => {
    try {
        console.log("backendapi: ", BACKEND_API);
        
        const response = await api.post<LoginResponse>('/login', {
            email: userName,
            password
        });

        return { user: response.data.user, status: 200, message: response.data.message , token:response.data.token };
    } catch (error) {
        console.error("❌ Lỗi khi đăng nhập:", error);
        return { status: error.status, message: error.response.data.error, user: null }
    }
};
