import { Link } from "react-router-dom"
import { Product } from "../../type";


export function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price)
}
interface OverviewProduct {
  product: Product;
}

export default function OverviewProduct({ product }: OverviewProduct) {

  return (
    <div className="product">
      <Link to={`/products/detail/${product.slug}`}>
        <div className="relative aspect-[3/4] mb-4 overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-[1.20]"
          />
          {product.discount >0 && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-semibold px-2 py-1 rounded">
              -{ Number( product.discount)}%
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center relative ">
            <h3 className="text-m text-black mr-3 font-medium line-clamp-2 hover:transition-colors">
              {product.name}
            </h3>
            <h4 className="text-black">{product.shortDescription}</h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">{formatPrice(product.price)}₫</span>
            <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)}₫</span>
          </div>
        </div>
      </Link>
    </div>
  )
}