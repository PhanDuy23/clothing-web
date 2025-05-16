
import { Bell, ChevronDown, Search, ShoppingBag, ShoppingCart, User } from "lucide-react"
import { Button } from "../ui/button"
import ShoppingCartModal from "./shopping-cart-modal"
import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Link } from "react-router-dom"
import { Category} from "../../type"
import { buildCategoryTree, getCategories } from "../../services/categories"
import { useAuth } from "../../redux/useAuth"
import useShoppingCart from "../../redux/useShoppingCart"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const {cart} = useShoppingCart()
  const {user} = useAuth()


  useEffect(() => {
    const getListCategories = async () => {
      const { categories } = await getCategories({status: 1})
      if (categories) {
        setCategories(buildCategoryTree(categories))
      }
    }
    getListCategories()
  }, []);
  console.log("header");


  const handleMouseEnter = (label: string) => {
    setActiveMenu(label)
  }

  const handleMouseLeave = () => {
    setActiveMenu(null)
  }
  return (
    <header className="w-full border-b fixed z-50 bg-white">
      {/* Top bar */}
      <div className="w-full bg-black text-white px-4 py-1 flex justify-between items-center text-sm">
        <div>
          Hotline mua hàng: <span className="font-semibold"> 0975758544</span>{" "}
          <span className="text-black-300">(8:30-21:30, Tất cả các ngày trong tuần)</span>
          {/* <span>{"   |   "}</span> */}
          {/* <Link href="lien-he">Liên hệ</Link> */}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-4 h-4" />
            {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span> */}
          </div>
          <span>Thông báo</span>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex h-full items-center hover:text-black">
          <h1 className="text-5xl pl-4 font-bold">1996 STORE</h1>
        </Link>
        <nav className="py-2">
          <div className="container mx-auto ">
            <ul className="flex flex-wrap items-center">
              {categories.map((item) => (
                <li
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  {
                    item.child.length <= 0 ?

                      (<Link
                        to={`/collections/${item.slug}`}
                        state={{ categoryName: item.name, categoryId: item.id }}
                        className="flex items-center px-5 py-4 text-black text-lg font-medium hover:text-black transition-colors"
                      >
                        {item.name}
                        {item.child?.length > 0 && <ChevronDown className="ml-1 h-4 w-4" />}
                      </Link>) :

                      (
                        <div>
                          <div
                            className="flex items-center px-5 py-4 text-lg font-medium text-black hover:text-black transition-colors"
                          >
                            {item.name}
                            {item.child?.length > 0 && <ChevronDown className="ml-1 h-4 w-4" />}
                          </div>
                          {activeMenu == item.name && <div className="absolute left-0 top-full bg-white shadow-lg min-w-56 z-10 border border-gray-100">
                            <ul className="py-2">
                              {item.child.map((child) => (
                                <li key={child.name}>
                                  <Link
                                    to={`/collections/${child.slug}`}
                                    state={{ categoryName: child.name, categoryId: child.id }}
                                    className="block px-6 py-3 hover:bg-gray-50 text-gray-900 hover:text-black transition-colors"
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          }
                        </div>
                      )
                  }
                </li>
              ))}
            </ul>
          </div>
        </nav>


        <div className="flex items-center gap-4 ">
          <Input placeholder="tìm kiếm" className="w-[300px]" />

          {/* <Button variant="ghost" size="icon">
              <Search className="w-6 h-6" />
          </Button> */}

          <Button variant="ghost" size="icon" asChild>
            <Link to={(user ? "/account" : "/login")}>
              <User className="w-6 h-6" />
            </Link>

          </Button>
          <div className="relative"  >
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
              <ShoppingCart className="w-6 h-6" />
            </Button>
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cart.length}
            </span>
            }
            <ShoppingCartModal isOpen={isOpen} onClose={() => setIsOpen(false) } user={user} />

          </div>
        </div>
      </nav>
    </header>
  )
}

