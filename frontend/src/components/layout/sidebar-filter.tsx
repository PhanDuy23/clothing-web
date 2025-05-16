"use client"

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Button } from "../ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { Slider } from "../ui/slider"
import { Category } from "../../type"
import { formatPrice } from "../../pages/client/complete-order";
import { Link } from "react-router-dom";
import { buildCategoryTree, getCategories } from "../../services/categories";


export default function SidebarFilter({priceRange, setPriceRange} :{priceRange: [number, number], setPriceRange: (value:[number, number])=>void}) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const getListCategories = async () => {
      const { categories } = await getCategories()
      if (categories) {
        setCategories(buildCategoryTree(categories))
      }
    }
    getListCategories()
  }, []);

  return (
    <div className="w-full max-w-[280px] space-y-4 p-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Bộ lọc</h2>

        <Accordion type="single" collapsible className="w-full bg-white">
          <AccordionItem value="categories">
            <AccordionTrigger className="bg-white text-lg">Danh mục sản phẩm</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.name}>
                    {category.child?.length ? (
                      <Collapsible>
                        <CollapsibleTrigger className="w-full" asChild>
                          <Button variant="ghost" className="w-full justify-between bg-white">
                            {category.name}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-4 space-y-2">
                          {category.child?.map((subCategory: Category) => (
                            <Button variant="ghost" className="w-full justify-between bg-white" key={subCategory.id} asChild>
                              <Link className="bg-white" to={`/collections/${subCategory.slug}`} state={{ categoryName: subCategory.name, categoryId: subCategory.id }} >{subCategory.name}</Link>
                            </Button>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <Collapsible>
                        <CollapsibleTrigger className="w-full" >
                          <Button variant="ghost" className="w-full justify-between bg-white" asChild>
                            <Link className="" to={`/collections/${category.slug}`} state={{ categoryName: category.name, categoryId: category.id }}>{category.name}</Link>
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="price">
            <AccordionTrigger className="bg-white text-lg">Khoảng giá</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-2">

                <Slider
                  min={0}
                  max={3000000}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  formatValue={formatPrice}
                />

              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

