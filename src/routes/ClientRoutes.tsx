import { Route, Routes } from "react-router-dom";
import ClientLayout from "../components/layout/ClientLayout";
import Home from "../pages/client/Home";

export default function ClientRoutes(){

    return(
        <Routes>
            <Route path = "/*" element={<ClientLayout/>}>
                <Route index element={<Home/>}/>
            </Route>
        </Routes>
    )
}