import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { getAllCategories } from "../../services/getApi"

const categories = [
  {
    name: "Áo Khoác",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8T49V2JeqzrqUETcyAfeD6XOmH6AEb.png",
    link: "/ao-khoac",
  },
  {
    name: "Bộ Nỉ",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8T49V2JeqzrqUETcyAfeD6XOmH6AEb.png",
    link: "/bo-ni",
  },
  {
    name: "Quần Jeans",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8T49V2JeqzrqUETcyAfeD6XOmH6AEb.png",
    link: "/quan-jeans",
  },
  {
    name: "Quần Âu",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8T49V2JeqzrqUETcyAfeD6XOmH6AEb.png",
    link: "/quan-au",
  },
]

export default function ProductCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function getData() {
      const data = await getAllCategories();
      setCategories(data);
    }
    // getData()
  })

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#5C0000]">DANH MỤC SẢN PHẨM</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.length ? categories.map((category) => (
          <div key={category.name} className="relative group overflow-hidden rounded-lg">
            <div className="aspect-[3/4]">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20">
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-2xl font-semibold">{category.name}</h3>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )): (
          <div>trống</div>
        )}
      </div>
    </section>
  )
}

