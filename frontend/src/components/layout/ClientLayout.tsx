import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
export default function ClientLayout() {

    return (
        <div>
            <div className="min-h-screen">
                <Header />
                <main className="min-h-full">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>

    )
}