import { SidebarAdmin } from "./sidebar-admin"
import { Outlet } from "react-router-dom"

export default function AdminLayout() {
  return ( 
    <div className="flex bg-gray-100">
      <div className="fixed">
        <SidebarAdmin />
      </div>
      <main className="flex flex-1">
        <div className="w-60 ">1</div>
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

