import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"

const orders = [
  {
    id: "AL2947",
    customer: "Phạm Thị Ngọc",
    total: "19.770.000 đ",
    status: "Chờ xử lý",
  },
  {
    id: "ER835",
    customer: "Nguyễn Thị Mỹ Yến",
    total: "16.770.000 đ",
    status: "Đang vận chuyển",
  },
  {
    id: "MD0837",
    customer: "Trần Thanh Thủy",
    total: "9.400.000 đ",
    status: "Đã hoàn thành",
  },
  {
    id: "MT9035",
    customer: "Đặng Hoàng Phúc",
    total: "40.650.000 đ",
    status: "Đã hủy",
  },
]

const statusStyles = {
  "Chờ xử lý": "bg-blue-100 text-blue-800",
  "Đang vận chuyển": "bg-yellow-100 text-yellow-800",
  "Đã hoàn thành": "bg-green-100 text-green-800",
  "Đã hủy": "bg-red-100 text-red-800",
}

export function OrdersTable() {
  return (
    <div className="border rounded-lg">
      <h2 className="p-4 font-semibold">Tình trạng đơn hàng</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID đơn hàng</TableHead>
            <TableHead>Tên khách hàng</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusStyles[order.status]}>
                  {order.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

