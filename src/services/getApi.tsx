import axios  from "axios";


// const api = axios.create({
//     baseURL: "http://170.205.36.201:5005/api/v1",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
  

export async function getAllCategories(){
    try{
        const response = await axios.get("http://170.205.36.201:5005/api/v1/category")
        return response.data        
    }catch(error){
        console.error("Lỗi khi gọi API:", error);
        return []
    }
}