import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Users, Package, ShoppingCart, AlertCircle } from "lucide-react"
import { getTotalUser } from "../../services/users";
import { getTotalOrdersThisMonth } from "../../services/order";
import { getTotalProducts } from "../../services/products";

const stats = [
  {
    title: "TỔNG KHÁCH HÀNG MỚI",
    value: "lỗi" ,
    unit: "khách hàng",
    icon: Users,
    color: "bg-green-500",
    description: "Tổng số khách hàng đang quản lý",
  },
  {
    title: "TỔNG SẢN PHẨM",
    value: "lỗi",
    unit: "sản phẩm",
    icon: Package,
    color: "bg-blue-500",
    description: "Tổng số sản phẩm đang quản lý",
  },
  {
    title: "TỔNG ĐƠN HÀNG TRONG THÁNG",
    value: "lỗi",
    unit: "đơn hàng",
    icon: ShoppingCart,
    color: "bg-orange-500",
    description: "Tổng số đơn hàng trong tháng",
  },
  // {
  //   title: "SẮP HẾT HÀNG",
  //   value: "4",
  //   unit: "sản phẩm",
  //   icon: AlertCircle,
  //   color: "bg-red-500",
  //   description: "Số sản phẩm cảnh báo sắp hết tồn kho",
  // },
]

export function StatsCards() {
  const [customerTotal, setCustomerTotal] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [productTotal, setProductTotal] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const customerRes = await getTotalUser("customer");
      const orderRes = await getTotalOrdersThisMonth();
      const productRes = await getTotalProducts();

      if (customerRes.status === 200) setCustomerTotal(customerRes.total);
      if (orderRes.status === 200) setOrderTotal(orderRes.total);
      if (productRes.status === 200) setProductTotal(productRes.total);
    };

    fetchStats();
  }, []);

  stats[0].value = customerTotal
  stats[1].value = productTotal
  stats[2].value = orderTotal


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`${stat.color} p-2 rounded-full`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/* <p className="text-xs text-muted-foreground">{stat.description}</p> */}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

