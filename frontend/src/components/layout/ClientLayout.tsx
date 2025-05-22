import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
export default function ClientLayout() {

    return (
        <div>
            <div className="min-h-screen">
                <Header />
                <div className="h-[105px]">header</div>
                <main className="min-h-full">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>

    )
}