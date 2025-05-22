"use client"
import { Facebook, Minus, Plus, Twitter } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { useNavigate, useParams } from "react-router-dom";
import useShoppingCart from "../../redux/useShoppingCart"
import { OrderItemType } from "../../type"
import useOrder from "../../redux/useOrder"
import { useEffect, useRef, useState } from "react"
import { addToCart } from "../../services/carts"
import { useProductDetail } from "../../custom_hook/useProducts"
import { useAuth } from "../../redux/useAuth"
import { IconLeft, IconRight } from "react-day-picker"



export function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState("null")
  const [selectedColor, setSelectedColor] = useState("null")
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [isOpenModal, setISOpenModal] = useState(false)
  const { productSlug } = useParams()
  const navigate = useNavigate()
  const { product, loading, error } = useProductDetail(productSlug);
  const {add} = useShoppingCart()
  const {setOrder} = useOrder()
  const {user} = useAuth()
  
  useEffect(() => {
    if (!loading && !error && product?.colors && product?.sizes) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);
  

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>❌ {error}</p>;
  if (!product) return <p>Không có dữ liệu sản phẩm</p>;

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")}đ`
  }
  
  const handleAddToCart = async () =>{
    const inforOrder : OrderItemType = {
      productId: product.id,
      color: selectedColor,
      size: selectedSize,
      quantity,
      price: product.price, 
      image: product.thumbnail,
      name: product.name
    }
    if(!user){
      navigate("/login")
    }else{
      add([inforOrder])
      const data = await addToCart( user.id, [inforOrder])
      alert(data?.message)
    }
  }

  const handleBuyNow = ()=>{
    const inforOrder : OrderItemType = {
      id: 0,
      productId: product.id,
      color: selectedColor,
      size: selectedSize,
      quantity,
      price: product.price, 
      image: product.thumbnail,
      name: product.name
    }
    setOrder([inforOrder]) 
    navigate("/complete-order")
  }

  return (
    <div className="container px-4 py-6">
      <div className="grid gap-6 grid-cols-7">
        <div className="space-y-4 col-span-2">
          <Carousel className="w-full relative">
            <CarouselContent >           
                <CarouselItem key={selectedTab}>
                  <div className=" aspect-square relative overflow-hidden rounded-lg flex items-center justify-center">
                    <img
                      src={product .images[selectedTab]}
                      alt={`${product.name} - Ảnh ${selectedTab + 1}`}
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>          
            </CarouselContent>
            <IconLeft className="absolute left-0 top-[170px] cursor-pointer hover:opacity-50"  onClick={()=> setSelectedTab(selectedTab >0 ? selectedTab-1: selectedTab)}/>
            <IconRight className="absolute top-[170px] right-0 cursor-pointer hover:opacity-50" onClick={()=> setSelectedTab(selectedTab < product.images.length-1 ? selectedTab +1: selectedTab)} />
          </Carousel>
          <div className="flex gap-2 overflow-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative w-[80px] overflow-hidden rounded border-2 ${selectedTab === index ? "border-primary" : "border-transparent"
                  }`}
                onClick={() =>{ setSelectedTab(index)  }}
              >
                <div className="aspect-square relative">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}

                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 col-span-3">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="mt-2 space-y-1 text-sm">
              <p>
                Mã sản phẩm: <span className="font-medium">{product.sku}</span>
              </p>
              <p>
                Tình trạng: <span className="font-medium text-green-600">{product.status || "còn hàng"}</span>
              </p>
              
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="flex items-center">
              <div className="text-sm text-">Giá:</div>
            </div>
            <div className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2">
              <div className="flex items-center">
                <div className="text-sm text-">Màu sắc:</div>
              </div>
              <div className="mt-2 flex gap-2">
                {product.colors.map((color) => (
                  <Button key={color} variant={selectedColor === color ? "default" : "outline"}
                    className="relative h-10 w-20"
                    onClick={() => setSelectedColor(color)}>
                    {color}

                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Kích thước:</label>
                <div className="relative mt-2 flex gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className="h-10 w-14"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}

                    </Button>
                  ))}
                </div>
                <Button variant="link" className="text-sm" onClick={() => setISOpenModal(true)} >
                  Hướng dẫn chọn size
                </Button>
                {isOpenModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[10]">
                    <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[50%] h-[80%] overflow-hidden pr-0">
                      <button
                        onClick={() => setISOpenModal(false)}
                        className="absolute bg-white right-0 top-0 text-black px-4 py-2 rounded hover:text-gray-500"
                      >
                        Đóng
                      </button>
                      <div className="flex justify-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                          Hướng dẫn chọn size
                        </h2>
                      </div>
                      <div className="overflow-auto h-full ">

                        <img src="https://theme.hstatic.net/200000690725/1001078549/14/tagsize_5_img.jpg?v=664" alt="hướng dẫn chọn size" className="pr-4" />
                      </div>

                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="grid grid-cols-2">
              <div className="flex items-center">
                <div className="text-sm text-">Số lượng:</div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-14 text-center">{quantity}</div>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <Button variant="outline" className="h-12" onClick={handleAddToCart}>
              THÊM VÀO GIỎ
            </Button>
            <Button className="h-12 bg-green-600 hover:bg-green-700" onClick={handleBuyNow}>
                MUA NGAY
            </Button>
            
          </div>

          <div>
            <div className="text-sm">Chia sẻ:</div>
            <div className="mt-2 flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Facebook className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Chia sẻ Facebook</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Chia sẻ Twitter</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      link
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sao chép liên kết</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="grid gap-4 col-span-2">
          <div>
            <h1 className="text-3xl font-bold-100">Mô tả thêm</h1> <br />
            <p>{product.detailDescription}</p>
          </div>
          {/* <div>
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <Image src="/placeholder.svg" alt="Free shipping" width={40} height={40} />
                </div>
                <div className="text-sm">Miễn phí giao hàng cho đơn hàng từ 500K</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <Image src="/placeholder.svg" alt="Authentic" width={40} height={40} />
                </div>
                <div className="text-sm">Hàng phân phối chính hãng 100%</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <Image src="/placeholder.svg" alt="COD" width={40} height={40} />
                </div>
                <div className="text-sm">Kiểm tra, thanh toán khi nhận hàng COD</div>
              </div>
            </Card>
          </div> */}
        </div>
      </div>
    </div>
  )
}

