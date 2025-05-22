import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCategories } from "../../services/categories"
import { Category } from "../../type"
import Pagination from "../layout/pagination"

export default function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState();               // phân trang  
  const [pageNow, setPageNow] = useState(1);
  const limit = 4;

  useEffect(() => {
    const getListCategories = async () => {
      const { categories, pagination } = await getCategories({ limit, page: pageNow, status: 1, parentId: "1" })
      if (categories) {
        setCategories(categories)
        setPagination(pagination)
      }
    }
    getListCategories()
  }, [pageNow]);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#5C0000]">DANH MỤC SẢN PHẨM</h2>
        <div className="flex gap-2">
                <Pagination onPageChange={setPageNow} currentPage={pageNow} totalPages={pagination?.totalPages} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.length ? categories.map((category) => (
          <Link to={`collections/${category.slug}`} state={{ categoryName: category.name, categoryId: category.id }} key={category.name} >
            <div key={category.name} className="relative group overflow-hidden rounded-lg">
              <div className="aspect-[3/4]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-20">
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="">
                    <h3 className="text-white text-2xl font-semibold">{category.name}</h3>
                    <p className="text-white text-1xl font-semibold">{category.description}</p>
                    {/* <Button size="icon" variant="outline" className="hover:opacity-70">
                      <ArrowRight className="h-5 w-5" />
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )) : (
          <div>trống</div>
        )}
      </div>

    </section>
  )
}

