import axios from 'axios';
import { UserType } from '../type';
import { number } from 'zod';
 
// Khởi tạo axios instance
const api = axios.create({
    baseURL: "http://localhost:5000/users",
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
    },
});

// Định nghĩa các kiểu dữ liệu

interface RegisterResponse {
    message: string;
    status: number,
    user: UserType;
}

interface LoginResponse {
    message: string;
    user: UserType;
}

interface ChangePasswordResponse {
    message: string;
}

interface UsersListResponse {
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
    users: UserType[];
}

interface DeleteUserResponse {
    message: string;
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
        const response = await api.post<LoginResponse>('/login', {
            userName,
            password
        });

        return { user: response.data.user, status: 200, message: response.data.message , token:response.data.token };
    } catch (error) {
        console.error("❌ Lỗi khi đăng nhập:", error);
        return { status: error.status, message: error.response.data.error, user: null }
    }
};

// Hàm lấy thông tin người dùng theo ID
export const getUserById = async (userId: number): Promise<UserType | null> => {
    try {
        const response = await api.get<UserType>(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Lỗi khi lấy thông tin người dùng ID ${userId}:`, error);
        return null;
    }
};

// Hàm cập nhật thông tin người dùng
export const updateUser = async (userId: number, userData) => {
    try {
        const response = await api.put(`/${userId}`, userData);
        return {data: response.data.user, status: 201};
    } catch (error) {
        console.error(`❌ Lỗi khi cập nhật người dùng ID ${userId}:`, error);
        return {status: error.status, message: error.response.data.error};
    }
};

// Hàm đổi mật khẩu
export const changePassword = async (
    userId: number,
    currentPassword: string,
    newPassword: string
): Promise<boolean> => {
    try {
        await api.put<ChangePasswordResponse>(`/${userId}/change-password`, {
            currentPassword,
            newPassword
        });
        return true;
    } catch (error) {
        console.error(`❌ Lỗi khi đổi mật khẩu cho người dùng ID ${userId}:`, error);
        return false;
    }
};

// Hàm lấy danh sách người dùng (có phân trang)
export const getUsers = async (page: number, limit: number, status : any, role: string): Promise<UsersListResponse | null> => {
    try {
        const response = await api.get<UsersListResponse>('/', {
            params: { page, limit, status, role }
        });
        console.log("getUsser", response.data);
        
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách người dùng:", error);
        return null;
    }
};

// Hàm xóa người dùng
export const deleteUser = async (userId: number): Promise<boolean> => {
    try {
        await api.delete<DeleteUserResponse>(`/${userId}`);
        return true;
    } catch (error) {
        console.error(`❌ Lỗi khi xóa người dùng ID ${userId}:`, error);
        return false;
    }
};

// Hàm tìm kiếm người dùng (ví dụ thêm)
export const searchUsers = async (searchTerm: string): Promise<UserType[] | null> => {
    try {
        const response = await api.get<UserType[]>('/search', {
            params: { q: searchTerm }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi tìm kiếm người dùng:", error);
        return null;
    }
};

export const getTotalUser = async (role: string) => {
    try {
        const response = await api.get<{ totalUser: number }>(`/count?role=${role}`);

        return { total: response.data.totalUser, status: 200 };
    } catch (error: any) {
        console.error("❌ Lỗi khi lấy tổng số khách hàng:", error);
        return { total: 0, status: error.response?.status || 500, message: error.response?.data?.error || "Lỗi server" };
    }
};
