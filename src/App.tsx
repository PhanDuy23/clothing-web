import {BrowserRouter, Routes, Route} from "react-router-dom"
import ClientRoutes from "./routes/ClientRoutes"

// import process from "process";


export default function App() {
  

  return (
   
      <BrowserRouter basename="/Clothing-web">
        <Routes>
          <Route path="/*" element={<ClientRoutes/>}/>
        </Routes>
      </BrowserRouter>
    
  )
}


