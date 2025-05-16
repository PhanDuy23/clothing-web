"use client"

import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Checkbox } from "../../components/ui/checkbox"
import Pagination from "../../components/layout/pagination"
import { useEffect, useState } from "react"
import { getUsers, updateUser } from "../../services/users"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { custom } from "zod"

interface Customer {
  id: number
  fullName: string
  address: string
  phone: string
  email: string
  status: number
  created_at: string
}

export function ClientManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<any>(1)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [pagination, setPagination] = useState();               // phân trang  
  const [pageNow, setPageNow] = useState(1);
  const limit = 10;

  useEffect(() => {
    const getData = async () => {
      const data = await getUsers(pageNow, limit, statusFilter, "customer")
      if (data) {
        setPagination(data.pagination)
        setCustomers(data.users || [])

      }
    }
    getData()
  }, [pageNow, statusFilter])


  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(c.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  )
  const handleStatusChange = async (id: number, status: number) => {
      const { data, message } = await updateUser(id, { status })
      if (data) {
        alert("Thay đổi thành công")
        const custommerNew = customers.filter(customer => customer.id !== id);
        setCustomers(custommerNew)
  
      } else {
        alert(message)
      }
    }

  return (
    <div className="container mx-auto h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quản Lý Khách Hàng</CardTitle>
         
        </CardHeader>

        <CardContent >
        <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên, email, ID nhân viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={1}>Đang hoạt động</SelectItem>
                <SelectItem value={0}>Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.id}</TableCell>
                      <TableCell>{customer.fullName}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{format(customer.created_at, "dd/MM/yyyy")}</TableCell>
                      <TableCell className="wrap">{customer.address}</TableCell>
                      <TableCell >
                        <Select
                          value={customer.status.toString()}
                          onValueChange={(value) => handleStatusChange(customer.id, Number(value))}

                        >
                          <SelectTrigger className="w-fit justify-center">
                            <SelectValue
                              placeholder="Chọn trạng thái"
                              className="text-center"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">
                              <Badge className="text-center bg-green-100 text-green-800">Đang hoạt động</Badge>
                            </SelectItem>
                            <SelectItem value="0">
                              <Badge className="bg-red-100 text-red-800">Không hoạt động</Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-sm text-muted-foreground">
                      Không có khách hàng nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <Pagination currentPage={pageNow} totalPages={pagination?.totalPages} onPageChange={setPageNow} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
