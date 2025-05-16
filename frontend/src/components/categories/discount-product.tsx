import { Button } from "../ui/button"
import OverviewProduct from "../product/overview-product"
import { useEffect, useState } from "react"
import { PaginationType, Product } from "../../type"
import { getProductsDiscount } from "../../services/products"
import { Link } from "react-router-dom"
import Pagination from "../layout/pagination"


export default function DiscountProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginationType>();
  const [currentPage, setCurrentPage] = useState(1)
  useEffect(() => {
    const getdata = async () => {
      const data = await getProductsDiscount({ page: currentPage, limit: 5 })
      if (data) {
        setProducts(data.products);
        setPagination(data.pagination)
      } else {
        alert("lỗi fetch discount")
      }
    }
    getdata()
  }, [currentPage])


  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full" />
          <h2 className="text-3xl font-bold text-[#5C0000]">SẢN PHẨM KHUYẾN MÃI</h2>
        </div>
        <div className="flex gap-2">
          <Pagination onPageChange={setCurrentPage} currentPage={currentPage} totalPages={pagination?.totalPages} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {products.map((product) => (
           <OverviewProduct product={product} key={product.id} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline" className="min-w-[300px]" asChild>
          <Link to={"collections/giam-gia"} state={{categoryName: "Giảm giá", categoryId: 16}}>
            XEM TẤT CẢ SẢN PHẨM KHUYẾN MÃI

          </Link>
        </Button>
      </div>
    </section>
  )
}

