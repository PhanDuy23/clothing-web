"use client"

import { CaseUpper, CheckCircle2, HelpCircle, ShoppingBag } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { Link, useLocation, useParams } from "react-router-dom"
import { OrderType } from "../../type"
import OverviewOrderItem from "../../components/product/overview-orderItem"
import { calculateTotalPrice } from "./complete-order"
import { useAuth } from "../../redux/useAuth"
import { translatePaymentStatus } from "./order-history"


export function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const { state } = location; // Truy xuất state
  const {user} = useAuth()
  // Kiểm tra xem state có tồn tại không
  if (!state) {
    return <p>Không có dữ liệu đơn hàng</p>;
  }

  // Lấy các giá trị từ state
  const { orderInf, orderItems } = state; //Lấy dữ liệu state được truyền từ navigate

  const orderData: OrderType = orderInf
// const orderData = null
  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")}₫`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle2 className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-semibold">Đặt hàng thành công</h1>
              <p className="text-sm text-gray-600">Mã đơn hàng #{orderId}</p>
              <p className="text-sm text-gray-600">Cảm ơn bạn đã mua hàng!</p>
            </div>
          </div>

          <Card className="p-6">
            <h2 className="mb-4 font-semibold">Thông tin đơn hàng</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Thông tin giao hàng</h3>
                <p className="mt-1">{user?.fullName}</p>
                <p className="mt-1">{user?.phone}</p>
                <p>{`${orderData.address}, ${orderData.wardName}, ${orderData.districtName}, Tỉnh ${orderData.provinceName}`}</p>
                {/* <p>{orderData.districtName}</p>
                <p>{orderData.provinceName}</p>
                <p>{orderData.wardName}</p> */}
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-gray-600">Phương thức thanh toán</h3>
                <p className="mt-1">{ translatePaymentStatus(orderData.paymentMethod) }</p>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <div className="space-y-4">
              {orderItems.map((item) => (
               
                  <OverviewOrderItem item={item} key={item.id}/>
              
              ))}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng</span>
                  <span>{formatPrice(calculateTotalPrice(orderItems))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(orderData.shippingFee)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Tổng cộng</span>
                  <span className="text-lg">VND {formatPrice(calculateTotalPrice(orderItems,orderData.shippingFee))}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <HelpCircle className="h-4 w-4" />
              <a href="/contact">Cần hỗ trợ? Liên hệ chúng tôi</a>
            </div>          
          </div> */}
        </div>
      </div>
    </div>
  )
}

