import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../redux/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole
}) => {
    const {user} = useAuth()
    const location = useLocation();

    // Hiển thị trạng thái loading nếu đang kiểm tra xác thực   
    console.log("user", user);

    // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Nếu cần vai trò cụ thể và người dùng không có vai trò đó
    if (requiredRole && user.role !== requiredRole) {
        alert("không đủ quyền")
        return <Navigate to="/" replace />;
    }

    // Nếu đã xác thực và có quyền truy cập, hiển thị nội dung
    return <>{children}</>;
};

export default ProtectedRoute;
