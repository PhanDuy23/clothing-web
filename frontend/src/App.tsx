import { BrowserRouter, Routes, Route } from "react-router-dom"
import ClientRoutes from "./routes/ClientRoutes"
import AdminLayout from "./components/admin/admin-layout"
import Dashboard from "./pages/admin/dashboard"
import { ProductsManagement } from "./pages/admin/product-management"
import { ClientManagement } from "./pages/admin/client-management"
import { OrderManagement } from "./pages/admin/order-management"
import { EmployeeManagement } from "./pages/admin/employee-management"
import CategoriesManagement from "./pages/admin/categories-management"
import ProtectedRoute from "./routes/protectedRoutes"
import { NewCategoryForm } from "./pages/admin/new-category-form"
import { ProductForm } from "./pages/admin/newproduct-form"
import SlideManagement from "./pages/admin/slide-management"
import { NewBannerForm } from "./pages/admin/slide-create"

export default function App() {


  return (

    <BrowserRouter >
      <Routes>
        <Route path="/*" element={<ClientRoutes />} />

        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products-management" element={<ProductsManagement />} />
          <Route path="products-management/create" element={<ProductForm />} />
          <Route path="products-management/update" element={<ProductForm />} />
          <Route path="client-management" element={<ClientManagement />} />
          <Route path="order-management" element={<OrderManagement />} />
          <Route path="employee-management" element={<EmployeeManagement />} />
          
          <Route path="categories-management" element={<CategoriesManagement />} />
          <Route path="categories-management/create" element={<NewCategoryForm/>} />

          <Route path="slide-management" element={<SlideManagement/>} />
          <Route path="slide-management/create" element={<NewBannerForm/>} />
        </Route>
      </Routes>
    </BrowserRouter >

  )
}


