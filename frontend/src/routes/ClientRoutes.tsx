import { Route, Routes } from "react-router-dom";
import ClientLayout from "../components/layout/ClientLayout";
import Home from "../pages/client/Home";
import Collections from "../pages/client/collections";
import { ProductDetail } from "../pages/client/product-detail";
import { ShoppingCart } from "../pages/client/shopping-cart";
import { CompleteOrder } from "../pages/client/complete-order";
import { LoginForm } from "../pages/client/login";
import { RegisterForm } from "../pages/client/register";
import { OrderConfirmation } from "../pages/client/order-comfirmation";
import Account from "../pages/client/account";
import PersonalInfor from "../pages/client/personal-infor";
import OrderHistory from "../pages/client/order-history";
import ProtectedRoute from "./protectedRoutes";

export default function ClientRoutes() {

    return (
        <Routes>
            <Route path="/*" element={<ClientLayout />}>
                <Route index element={<Home />} />
                <Route path="collections/:categorySlug" element={<Collections />} />
                <Route path="products/detail/:productSlug" element={<ProductDetail />} />
                <Route path="shopping-cart" element={
                    <ProtectedRoute requiredRoles={["customer"]}>
                        <ShoppingCart />
                    </ProtectedRoute>} 
                />
                <Route path="complete-order" element={
                    <ProtectedRoute requiredRoles={["customer"]}>
                        <CompleteOrder />
                    </ProtectedRoute>}
                />
                <Route path="login" element={<LoginForm />} />
                <Route path="register" element={<RegisterForm />} />
                <Route path="order-confirmtion/:orderId" element={
                    <ProtectedRoute>
                        <OrderConfirmation />
                    </ProtectedRoute>}
                />


                <Route path="account/*" element={
                    <ProtectedRoute requiredRoles={["customer"]}>
                        <Account />
                    </ProtectedRoute>
                }>
                    <Route index element={<PersonalInfor />} />
                    {/* <Route path="addresses" element={<Addresses />} /> */}
                    {/* <Route path="security" element={<Security />} /> */}
                    <Route path="order-history" element={<OrderHistory />} />
                    {/* <Route path="payment-methods" element={<PaymentMethods />} /> */}
                </Route>
            </Route>
        </Routes>
    )
}