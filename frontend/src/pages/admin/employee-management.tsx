"use client"

import { format } from "date-fns"
import {  UserPlus } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell,  TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import Pagination from "../../components/layout/pagination"
import { useEffect, useState } from "react"
import { getUsers, registerUser, updateUser } from "../../services/users"
import { Employee } from "../../type"


export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<any>(1)
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [pagination, setPagination] = useState();               // phân trang  
  const [pageNow, setPageNow] = useState(1);
  const limit = 10;

  useEffect(() => {
    const getData = async () => {
      const data = await getUsers(pageNow, limit, statusFilter, "admin")
      if (data) {
        setPagination(data.pagination)
        setEmployees(data.users || [])

      }
    }
    getData()
  }, [pageNow, statusFilter])


  const filteredEmployees = employees
    .filter(
      (employee) =>
      (employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(employee.id).toLowerCase().includes(searchQuery.toLowerCase()))
    )


  const handleAddEmployee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newEmployee = {
      id: `EMP${(employees.length + 1).toString().padStart(3, "0")}`,
      fullName: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as string,
      userName: formData.get("userName") as string,
      password: formData.get("password") as string,
    }
    console.log(newEmployee);
    const { user, message } = await registerUser(newEmployee)
    if (user) {
      alert("Thêm tài khoản nhân viên thành công")
      setIsAddingEmployee(false)

    } else {
      alert(message)
    }

  }

  const handleStatusChange = async (id, status) => {
    const { data, message } = await updateUser(id, { status })
    if (data) {
      alert("Thay đổi thành công")
      const employeeNew = employees.filter(employ => employ.id !== id);
      setEmployees(employeeNew)

    } else {
      alert(message)
    }
  }


  return (
    <div className="container mx-auto h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quản Lý Nhân Viên</CardTitle>
          {/* <CardDescription>Quản lý thông tin và hiệu suất của nhân viên</CardDescription> */}
        </CardHeader>
        <CardContent>
          {/* Action Buttons */}

          {/* Search and Filter */}
          <div className="mb-6 flex flex-wrap gap-3">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên, email, ID nhân viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex-1">
              <Button variant="outline" size="sm" onClick={() => setIsAddingEmployee(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm nhân viên mới
              </Button>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={1}>Đang làm việc</SelectItem>
                <SelectItem value={0}>Đã nghỉ việc</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Employees Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees?.length > 0 ? filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell>
                      {employee.fullName}
                    </TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{format(employee.created_at, "dd/MM/yyyy")}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell className="flex justify-center items-center">
                      <Select
                        value={employee.status.toString()}
                        onValueChange={(value) => handleStatusChange(employee.id, Number(value))}

                      >
                        <SelectTrigger className="w-fit justify-center">
                          <SelectValue
                            placeholder="Chọn trạng thái"
                            className="text-center"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">
                            <Badge className="text-center bg-green-100 text-green-800">Đang làm việc</Badge>
                          </SelectItem>
                          <SelectItem value="0">
                            <Badge className="bg-red-100 text-red-800">Đã nghỉ việc</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                  </TableRow>
                )) :
                  (<TableRow>
                    <TableCell className="font-medium">trống</TableCell>
                  </TableRow>)
                }
              </TableBody>

            </Table>
          </div>

          {/* Pagination */}

          <Pagination currentPage={pageNow} totalPages={pagination?.totalPages} onPageChange={setPageNow} />
        </CardContent>
      </Card>


      {/* Add Employee Dialog */}
      <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm nhân viên mới</DialogTitle>
            <DialogDescription>Điền thông tin của nhân viên mới vào form dưới đây.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEmployee}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Họ và tên
                </Label>
                <Input id="name" name="name" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" name="email" type="email" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Số điện thoại
                </Label>
                <Input id="phone" name="phone" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Vị trí
                </Label>
                <select id="role" name="role" className="col-span-3" required>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userName" className="text-right">
                  Tên tài khoản
                </Label>
                <Input id="userName" name="userName" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  mật khẩu
                </Label>
                <Input id="password" name="password" className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Thêm nhân viên</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}

