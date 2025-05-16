"use client"

import { Product } from "../../type"
import OverviewProduct from "./overview-product";


interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {

  return (
    <div className={`ProductGrid`}>  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <OverviewProduct product = {product} key={product.id}/>
        ))}
      </div>
    </div>
  )
}

