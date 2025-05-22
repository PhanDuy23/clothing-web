"use client"

import { format } from "date-fns"
import { MoreHorizontal, Eye, Trash2, Package, Truck, CheckCircle, Edit, Key } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import type { OrderType } from "../../type"
import Pagination from "../../components/layout/pagination"
import { Fragment, useEffect, useState } from "react"
import { getOrders, updateOrderStatus } from "../../services/order"
import { translatePaymentStatus } from "../client/order-history"
import { getOrderItems } from "../../services/order-items"
import type { OrderItemType } from "../../type"

export function OrderManagement() {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [status, setStatus] = useState("pending")
  const [pagination, setPagination] = useState()
  const [pageNow, setPageNow] = useState(1)
  const limit = 7
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([])

  useEffect(() => {
    const loadOrders = async () => {
      const { success, pagination, orders, message } = await getOrders({ page: pageNow, limit, status })
      if (success) {
        setOrders(orders)
        setPagination(pagination)
      } else {
        alert(message)
      }
    }
    loadOrders()
  }, [status, pageNow])

  const filteredOrders = orders.filter(
    (order) => order.id.toLowerCase().includes(searchQuery.toLowerCase()), //||
    // order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStatusChange = async (orderId: string, newStatus: OrderType["status"]) => {
    const { success, message } = await updateOrderStatus(orderId, newStatus)
    if (success) {
      setOrders(orders.filter((order) => order.id !== orderId))
      alert(message)
    } else {
      alert(message)
    }
  }

  const orderDetail = async (orderId: string) => {
    const { success, items, message } = await getOrderItems(orderId)
    if (success) {
      setOrderItems(items)
      setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
    } else {
      alert(message)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "bank":
        return "bg-green-100 text-green-800"
      case "cod":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }


  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quản Lý Đơn Hàng</CardTitle>
          {/* <CardDescription>Xem và quản lý tất cả đơn hàng của cửa hàng</CardDescription> */}
        </CardHeader>
        <CardContent>
          {/* Action Buttons */}

          {/* Search and Filter */}
          <div className="mb-6 flex flex-wrap gap-3">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo ID đơn hàng"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái đơn hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Chưa xử lý</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="shipped">Đã gửi hàng</SelectItem>
                <SelectItem value="delivered">Đã giao hàng</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Đơn hàng</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Mã khách hàng</TableHead>
                  <TableHead>Địa chỉ giao hàng</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  {/* <TableHead>Trạng thái thanh toán</TableHead> */}
                  <TableHead className="">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                 <Fragment key={order.id}>
                    <TableRow key={order.id}>
                      <TableCell
                        className="font-medium hover:text-primary "
                      > {order.id}
                      </TableCell>
                      <TableCell>{format(order.created_at, "dd/MM/yyyy HH:mm")}</TableCell>
                      <TableCell className="text-center"> {order.userId} </TableCell>
                      <TableCell>
                        {/* <div>{order.userId}</div> */}
                        <div className="text-sm text-gray-500">
                          {"  " + ` ${order.address}, ${order.ward}, ${order.district}, ${order.province}`}
                        </div>
                      </TableCell>
                      <TableCell>{order.total.toLocaleString("vi-VN")}đ</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.paymentMethod)}>
                          {translatePaymentStatus(order.paymentMethod)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center">
                          <Eye
                            className="mr-2 h-4 w-4 cursor-pointer hover:text-primary"
                            onClick={() => orderDetail(order.id)}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Cập nhật trạng thái</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "pending")}>
                                <Package className="mr-2 h-4 w-4" />
                                Chưa xử lý
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "processing")}>
                                <Package className="mr-2 h-4 w-4" />
                                Đang xử lý
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "shipped")}>
                                <Truck className="mr-2 h-4 w-4" />
                                Đã gửi hàng
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "delivered")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Đã giao hàng
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleStatusChange(order.id, "cancelled")}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hủy đơn hàng
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                      </TableCell>
                    </TableRow>
                    {expandedOrderId === order.id && (
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={7} className="p-0">
                          <div className="p-4">
                            <h4 className="font-medium mb-2">Chi tiết đơn hàng #{order.id}</h4>
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Hình ảnh</TableHead>
                                    <TableHead>Tên sản phẩm</TableHead>
                                    <TableHead>Kích thước</TableHead>
                                    <TableHead>Màu sắc</TableHead>
                                    <TableHead>Số lượng</TableHead>
                                    <TableHead>Đơn giá</TableHead>
                                    <TableHead>Thành tiền</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {orderItems.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>
                                        <img
                                          src={item.image || "/placeholder.svg"}
                                          alt={item.name}
                                          className="w-12 h-12 object-cover rounded"
                                        />
                                      </TableCell>
                                      <TableCell>{item.name}</TableCell>
                                      <TableCell>{item.size}</TableCell>
                                      <TableCell>{item.color}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>{item.price.toLocaleString("vi-VN")}đ</TableCell>
                                      <TableCell>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                 </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <Pagination currentPage={pageNow} totalPages={pagination?.totalPages} onPageChange={setPageNow} />
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
    </div>
  )
}
