
import { useEffect, useState } from "react";
import { ProductGrid } from "../../components/product/product-grid";
import SidebarFilter from "../../components/layout/sidebar-filter";
import { useLocation, useParams } from "react-router-dom";
import { getProductsByCategory } from "../../services/products";
import { PaginationType, Product } from "../../type";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react"
import Pagination from "../../components/layout/pagination";


const sortOptions = [
    // { label: "Sản phẩm nổi bật", value: "featured" },
    { label: "Giá: Thấp đến cao", value: "price-asc" },
    { label: "Giá: Cao đến thấp", value: "price-desc" },
    { label: "Mới nhất", value: "newest" },
]

function sortProducts(products: Product[], sortOption: string): Product[] {
    switch (sortOption) {
      case "price-asc":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...products].sort((a, b) => b.price - a.price);
      case "newest":
        return [...products].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return products;
    }
  }

export default function Collections() {
    const { categorySlug } = useParams();
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState<PaginationType>(null);
    const [currentPage, setCurrentPage] = useState(1)
    const [sort, setSort] = useState("newest")
    const location = useLocation();  
    const { categoryName, categoryId } = location.state ||{categoryName: "Danh Mục", categoryId: 1}

    useEffect(() => {
        if (!categorySlug) return;

        const fetchProducts = async () => {
            const data = await getProductsByCategory(categoryId, 8, currentPage, 1 , priceRange);
            setProducts(data.products);
            setPagination(data.pagination)
        };

        fetchProducts();
        
    }, [categoryId, priceRange, currentPage]); // Chạy lại khi categorySlug thay đổi

    const sortedProducts = sortProducts(products, sort);

    return (
        <div className="flex h-screen">
            <SidebarFilter priceRange={priceRange} setPriceRange={setPriceRange} />
            <main className="flex-1 p-4 overflow-auto scroll-hidden">
                <div>
                    <div className="flex items-center justify-between mb-8">

                        <h1 className="text-2xl font-bold">
                            {categoryName}
                            <span className="text-base font-normal text-muted-foreground ml-2">{pagination?.totalItems} sản phẩm</span>
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sắp xếp theo</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="min-w-[180px] justify-between">
                                        {sortOptions.find((option) => option.value === sort)?.label}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[180px]">
                                    {sortOptions.map((option) => (
                                        <DropdownMenuItem key={option.value} onClick={() => setSort(option.value)}>
                                            {option.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <ProductGrid products={sortedProducts} />
                    <Pagination currentPage={currentPage} totalPages={pagination?.totalPages} onPageChange={setCurrentPage} />
                </div>
            </main>
        </div>

    )
}