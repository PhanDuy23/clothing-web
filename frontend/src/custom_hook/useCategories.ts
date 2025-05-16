import { useState, useEffect } from "react";
import { getCategories } from "../services/categories"; // Hàm gọi API
import { Category } from "../type";

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // Truy vấn dựa trên `type`
        setCategories(data.categories);
        setPagination(data.pagination)
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []); // Chạy lại nếu `type` thay đổi

  return { categories, pagination, loading, error };
};

export default useCategories;
