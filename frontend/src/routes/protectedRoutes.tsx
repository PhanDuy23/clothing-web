import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../redux/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: [];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRoles
}) => {
    const { user } = useAuth()
    const location = useLocation();
    const navigate = useNavigate()
    // Hiển thị trạng thái loading nếu đang kiểm tra xác thực   
    console.log("user", user);

    // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRoles && !requiredRoles.includes(user.role)) {
        useEffect(() => {
            alert("Không đủ quyền");
            console.log("path", location.pathname);
            navigate(-1);
        }, []);

        return null; // Không render nội dung gì
    }

    // Nếu đã xác thực và có quyền truy cập, hiển thị nội dung
    return <>{children}</>;
};

export default ProtectedRoute;
