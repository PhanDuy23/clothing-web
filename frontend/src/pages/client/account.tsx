import { Outlet } from "react-router-dom";
import { ClientSidebar } from "../../components/layout/client-sidebar";

export default function Account() {

    return (
        <div className="flex min-h-full w-[100%] p-2 ">
            <ClientSidebar />
            <main className="flex-1 p-4">
                <Outlet />             
            </main>
        </div>

    )
}