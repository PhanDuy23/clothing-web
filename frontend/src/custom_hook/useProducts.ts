import { useEffect, useState } from "react";
import { ProductDetail } from "../type";
import { getProductDetail } from "../services/products";

export const useProductDetail = (slug: string) => {
    const [product, setProduct] = useState<ProductDetail>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getProductDetail(slug);
                if (data) {
                    setProduct(data);
                } else {
                    setError("Không tìm thấy sản phẩm");
                }
            } catch (err) {
                setError("Lỗi khi lấy dữ liệu sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    return { product, loading, error };
};
