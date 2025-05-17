import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/search",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
  },
});

export async function search(query: {query: String}) {
  try {
    const res = await api.get("/",{
        params: query
    })
    return res.data
  } catch (error) {
    console.error("Lỗi khi get banners:", error);
    return error.response.data
  }
}