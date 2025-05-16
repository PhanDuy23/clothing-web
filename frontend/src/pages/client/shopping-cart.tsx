"use client"

import { Minus, Plus, Truck, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import OverviewOrderItem from "../../components/product/overview-orderItem"
import { calculateTotalPrice, formatPrice } from "./complete-order"
import { useEffect, useState } from "react"
import { OrderItemType } from "../../type"
import useOrder from "../../redux/useOrder"
import { useNavigate } from "react-router-dom"
import useShoppingCart from "../../redux/useShoppingCart"

export function ShoppingCart() {
  
  const navigate = useNavigate()
  const { setOrder } = useOrder()
  const { remove, cart } = useShoppingCart() // danh sách hiển thị
  const [cartItems, setCartItems] = useState<OrderItemType[]>(cart) // danh sách đã chọn 

  const handleBuyNow = () => {
    setOrder(cartItems)
    navigate("/complete-order")
  }

  const handleRemoveItem = (id: number) => {
    setCartItems(cart.filter((item) => item.id !== id))
    remove(id)
  }

  const handleCheckBox = (checked: boolean,id: number) => {
    if (checked) {
      // Tìm sản phẩm trong danh sách gốc
      const itemToAdd = cart.find((item) => item.id === id);
      if (itemToAdd && !cartItems.some((item) => item.id === id)) {
        setCartItems( [...cartItems, itemToAdd]); // thêm sản phẩm
      }
    } else {
      // Bỏ sản phẩm ra khỏi cart
      setCartItems(cartItems.filter((item) => item.id !== id));
    }
   
  }

  
  return (
    <div className="container mx-auto px-4 py-6 min-h-full">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
            <span className="text-muted-foreground">Bạn đang có {cart.length} sản phẩm trong giỏ hàng</span>
          </div>

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-green-500" />
            </div>
            <div className="relative flex justify-between items-center">
              <span className="bg-background px-2 text-sm text-muted-foreground">Bạn đã được MIỄN PHÍ VẬN CHUYỂN</span>
              <span className="bg-background">
                <Truck className="h-5 w-5 text-green-500" />
              </span>
            </div>
          </div> */}

          <div className="space-y-4">
            {cart.map((item) => (
              <OverviewOrderItem item={item} key={ item.id || item.price} handleRemoveItem={handleRemoveItem} handleCheckBox={handleCheckBox} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Tổng tiền:</span>
                <span className="font-bold text-green-600 text-xl">{formatPrice(calculateTotalPrice(cartItems))}</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>* Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
                {/* <li>* Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</li> */}
              </ul>
              <Button className="w-full h-12 bg-green-600 hover:bg-green-700" onClick={handleBuyNow}>THANH TOÁN NGAY</Button>
            </div>
          </Card>
          {/* 
          <Alert className="bg-blue-50 text-blue-900 border-blue-200">
            <AlertDescription>
              Chính sách mua hàng: Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị tối thiểu 0đ trở lên.
            </AlertDescription>
          </Alert>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Khuyến mãi dành cho bạn</h2>
            <div className="h-20 rounded border-2 border-dashed flex items-center justify-center text-muted-foreground">
              Chưa có khuyến mãi nào
            </div>
          </Card> */}
        </div>
      </div>
    </div>
  )
}

