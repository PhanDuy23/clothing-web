import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"

const customers = [
  {
    id: "#183",
    name: "Hồ Việt Trung",
    birthDate: "21/7/1995",
    phone: "0123456789",
    address: "123 Nguyễn Văn Cừ, Q.5, TP.HCM",
  },
  // Add more customers as needed
]

export function NewCustomers() {
  return (
    <div className="border rounded-lg">
      <h2 className="p-4 font-semibold">Khách hàng mới</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên khách hàng</TableHead>
            <TableHead>Ngày sinh</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Địa chỉ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.birthDate}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

