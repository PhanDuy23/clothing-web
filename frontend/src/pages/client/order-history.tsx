import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ArrowRight, Edit, Package, ShoppingBag, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getOrdersByUser, updateOrderStatus } from "../../services/order"
import { OrderType } from "../../type"
import OverviewOrderItem from "../../components/product/overview-orderItem"
import { formatPrice } from "./complete-order"
import { useAuth } from "../../redux/useAuth"
import Pagination from "../../components/layout/pagination"

const formatWithVietnameseTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh", // Vietnamese timezone
  })
}

export function translatePaymentStatus(method: string) {
  const methodMap = {
    cod: "Thanh toán khi nhận hàng",
    bank: "Đã thanh toán",

  }

  return methodMap[method] || "Không xác định"
}

export default function OrderHistory() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<OrderType[]>([]);         // danh sách đơn hàng
  const [status, setStatus] = useState("pending");          // trạng thái được chọn để lọc
  const [pagination, setPagination] = useState();               // phân trang  
  const [pageNow, setPageNow] = useState(1);
  const limit = 5;

  useEffect(() => {
    const loadOrders = async () => {
      const { success, pagination, orders, message } = await getOrdersByUser(user?.id, { page: pageNow, limit, status: (status == "all") ? null : status });
      if (success) {
        setOrders(orders)
        setPagination(pagination)
      } else {
        alert(message)
      }
    };
    loadOrders();
  }, [status, pageNow, user]);

  const handleStatusChange = async (orderId: string, newStatus: OrderType["status"]) => {
    const { success, message } = await updateOrderStatus(orderId, newStatus)
    if (success) {
      setOrders(orders.filter((order) => order.id !== orderId))
      alert(message)
    } else {
      alert(message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Lịch sử đơn hàng</h2>
      </div>

      <Tabs
        defaultValue="all"
        value={status}
        onValueChange={(value) => setStatus(value)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          {/* <TabsTrigger value="all">Tất cả</TabsTrigger> */}
          <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="processing">Đang vận chuyển</TabsTrigger>
          <TabsTrigger value="delivered">Đã giao hàng</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>
      </Tabs>
      {orders.length === 0 ?
        (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Không có đơn hàng nào</h3>
            <p className="text-muted-foreground mt-2">Bạn chưa có đơn hàng nào trong mục này</p>
          </div>
        ) : (<div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between">
                  <p className="text-base col-span-2">Mã đơn hàng: {order.id}</p>
                  {status == "pending" && <Button
                    className="text-red-600 bg-white hover:bg-gray-100"
                    onClick={() => handleStatusChange(order.id, "cancelled")}
                  >
                    {/* <Trash2 className="mr-2 h-4 w-4" /> */}
                    Hủy đơn hàng
                  </Button>}
                </CardTitle>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">

                  <div className="flex-1 min-w-[200px]">
                    <CardDescription className="text-black">
                      Ngày đặt hàng: {formatWithVietnameseTime(order.created_at)}
                    </CardDescription>
                  </div>

                  <div className="flex-1 ">
                    <CardDescription className="text-black">
                      Thanh toán: {translatePaymentStatus(order.paymentMethod)}
                    </CardDescription>
                  </div>
                  <div className="flex w-full ">
                    <CardDescription className="text-black">
                      Địa chỉ giao hàng:
                      {"  " + ` ${order.address}, ${order.ward}, ${order.district}, ${order.province}`}
                    </CardDescription>
                  </div>

                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <OverviewOrderItem item={item} key={item.id} />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div>
                  <p className="text-sm text-black">Tổng tiền: <span className="font-medium text-black"> {formatPrice(order.total)}</span></p>

                </div>

              </CardFooter>
            </Card>
          ))}

        </div>)

      }
      {/* <OrderList orders={orders} /> */}
      <Pagination currentPage={pageNow} totalPages={pagination?.totalPages} onPageChange={setPageNow} />
    </div>
  )
}

function OrderList({ orders }: { orders: any[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Không có đơn hàng nào</h3>
        <p className="text-muted-foreground mt-2">Bạn chưa có đơn hàng nào trong mục này</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base col-span-2">Mã đơn hàng: {order.id}</CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">

              <div className="flex-1 min-w-[200px]">
                <CardDescription>
                  Ngày đặt hàng: {formatWithVietnameseTime(order.created_at)}
                </CardDescription>
              </div>

              <div className="flex-1 ">
                <CardDescription>
                  Thanh toán: {translatePaymentStatus(order.paymentMethod)}
                </CardDescription>
              </div>
              <div className="flex w-full ">
                <CardDescription>
                  Địa chỉ giao hàng:
                  {"  " + ` ${order.address}, ${order.ward}, ${order.district}, ${order.province}`}
                </CardDescription>
              </div>

            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <OverviewOrderItem item={item} key={item.id} />
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Tổng tiền: <span className="font-medium text-black"> {formatPrice(order.total)}</span></p>

            </div>
            {/* <Link href={`/account/orders/${order.id}`}>
              <Button variant="outline" size="sm">
                Chi tiết
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link> */}
          </CardFooter>
        </Card>
      ))}

    </div>
  )
}

