
import { useEffect } from "react";
import  HeroSlider  from "../../components/layout/HeroSlider";
import  Footer  from "../../components/layout/Footer";
import  ProductCategories  from "../../components/categories/product-categories";
import DiscountProducts from "../../components/categories/discount-product";
export default function Home() {
   

    return (
        <div>
            
            <HeroSlider/>
            <ProductCategories/>
            <DiscountProducts/>
            <Footer/>
        </div>
    )
}

