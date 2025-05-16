"use client"

import { cn } from "../../lib/utils"
import { User, ShoppingBag, LogOut } from "lucide-react"

import { useAuth } from "../../redux/useAuth"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"

const menuItems = [
  {
    title: "Thông tin tài khoản",
    href: "/account",
    icon: User,
    // This item should be active on the main account page and any direct subpages
    isRootItem: true,
  },
  // {
  //   title: "Địa chỉ giao hàng",
  //   href: "/account/addresses",
  //   icon: MapPin,
  // },
  {
    title: "Lịch sử đơn hàng",
    href: "/account/order-history",
    icon: ShoppingBag,
  },
 
]

export function ClientSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { logout } = useAuth()
  const navigate = useNavigate()

  // Function to check if a menu item is active
  const isItemActive = (item: (typeof menuItems)[0]) => {
    // Exact match
    if (pathname === item.href) return true

    return false
  }

  return (
    <div className="relative flex flex-col space-y-6 p-4 justify-between border-r border-black min-h-[100%]">
      <div className="flex flex-col space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
              isItemActive(item) ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>
      <div className="border-t pt-4 mt-auto">
        <Button
          onClick={() => {
            logout()
            navigate("/")
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
