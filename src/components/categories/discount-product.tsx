import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"

const products = [
  {
    id: 1,
    name: "Áo khoác nỉ vải hiệu ứng dập logo Horse cao su FWCS004",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XTOwmhdxWxkleLZikIPp2GtgJA6qoH.png",
    colors: 4,
    sizes: 4,
    price: 549000,
    originalPrice: 750000,
    discount: 27,
  },
  {
    id: 2,
    name: "Áo khoác da lộn basic cổ cao FWCL002",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XTOwmhdxWxkleLZikIPp2GtgJA6qoH.png",
    colors: 6,
    sizes: 4,
    price: 649000,
    originalPrice: 850000,
    discount: 24,
  },
  // Add more products as needed
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price)
}

export default function DiscountProducts() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full" />
          <h2 className="text-3xl font-bold text-[#5C0000]">SẢN PHẨM KHUYẾN MÃI</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <div key={product.id} className="group">
            <div className="relative aspect-[3/4] mb-4">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
              {product.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-semibold px-2 py-1 rounded">
                  -{product.discount}%
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex gap-2 text-sm text-gray-600">
                <span>+{product.colors} Màu sắc</span>
                <span>+{product.sizes} Kích thước</span>
              </div>
              <h3 className="text-sm font-medium line-clamp-2 group-hover:text-red-600 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-semibold">{formatPrice(product.price)}₫</span>
                <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)}₫</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline" className="min-w-[300px]">
          XEM TẤT CẢ SẢN PHẨM KHUYẾN MÃI
        </Button>
      </div>
    </section>
  )
}

