import { Avatar, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  LogOut,
  User,
} from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../redux/useAuth"

export function SidebarAdmin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const directList = [
            { icon: LayoutDashboard, label: "Báo cáo", link: null },         
            { icon: Users, label: "Quản lý khách hàng", link: "client-management" },
            { icon: Package, label: "Quản lý sản phẩm", link: "products-management" },
            { icon: Package, label: "Quản lý Danh mục", link: "categories-management" },
            { icon: ClipboardList, label: "Quản lý đơn hàng", link: "order-management" },
            { icon: Package, label: "Quản lý slide", link: "slide-management" },
          ] 
  if(user?.role == "manager"){
    directList.push({ icon: Users, label: "Quản lý nhân viên", link: "employee-management" })
  }
  directList.push({ icon: User, label: "Tài khoản", link: "account" })
  return (
    <div className="flex flex-col space-y-6 p-4  h-screen w-60 bg-[#0a1e46]">
      <div className="flex flex-col space-y-4 py-4 h-full">
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 px-2">
            <Avatar>
              {/* <AvatarImage src="/placeholder.svg" alt="Avatar" /> */}
              <AvatarFallback>VT</AvatarFallback>
            </Avatar>
            <div className="text-white">
              <h3 className="font-medium">{user?.fullName}</h3>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
          </div>
        </div>
        <div className="space-y-3  ">
          { directList .map((item) => (
            <NavLink to={item.link ? `/admin/${item.link}` : "/admin"}
                    end={!item.link} key={item.label} className={({ isActive }) => `flex w-[100%] p-2 rounded-md justify-start text-center items-center gap-2 hover:text-white ${isActive
              ? "bg-white/10 text-white"
              : "bg-white text-black-200 hover:text-white hover:bg-white/10"}`}>

              <item.icon className="h-4 w-4" />
              {item.label}

            </NavLink>
          ))}
        </div>
        <div className="flex flex-col flex-1 justify-end">
          <Button
            onClick={() => {
              logout()
              navigate("/login")
            }}
            variant="ghost"
            className="w-full justify-center gap-2 bg-white text-black-200 hover:text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  )
}

