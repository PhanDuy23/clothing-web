import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Plus, Trash2, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Category } from "../../type"
import {  getCategories, updateCategory } from "../../services/categories"
import Pagination from "../../components/layout/pagination"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "../../components/ui/dialog"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<number>(1)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [pagination, setPagination] = useState();               // phân trang  
  const [pageNow, setPageNow] = useState(1);
  const limit = 3;


  useEffect(() => {
    const getListCategories = async () => {
      const { categories, pagination, message } = await getCategories({ limit, page: pageNow, status: statusFilter })
      if (categories) {
        setCategories(categories)
        setPagination(pagination)
      } else {
        setCategories([])
       
        alert(message)
      }
    }
    getListCategories()
  }, [pageNow, statusFilter]);


  const categoriesFilter = categories
    .filter(
      (category) =>
      (category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(category.id).toLowerCase().includes(searchQuery.toLowerCase()))
    )

  const handleConfirmCategory = async (categoryId: number, status: number) => {
    setOpenDelete(false)
    console.log("cateid", categoryId);

    const { success, message } = await updateCategory(categoryId, { status })
    if (success) {
      const categoriesNew = categories.filter(category => category.id !== categoryId);
      setCategories(categoriesNew)
      alert(`${statusFilter == 1 ? "Xóa" : "Khôi phục"} thành công`)
    } else {
      alert(message)
    }

  }
  return (
    <div className="relative">
      <Card className="">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quản Lý Danh Mục</CardTitle>
          {/* <CardDescription>Xem và quản lý tất cả đơn hàng của cửa hàng</CardDescription> */}
        </CardHeader>
        <CardContent>

          <div className="mb-6 flex flex-wrap gap-3">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo ID đơn hàng, tên khách hàng, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex-1">
              <Button variant="outline" size="sm" asChild>
                <Link
                  to="create"
                  state={{ categories }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm danh mục
                </Link>

              </Button>

            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={1}>Đang hoạt động</SelectItem>
                <SelectItem value={0}>Đã xóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="color-black">
                  <TableHead >Mã</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>ID Cha</TableHead>
                  <TableHead>Ảnh đại diện</TableHead>
                  <TableHead className="text-right">Chức năng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoriesFilter.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.parentId? category.parentId : "không có"}</TableCell>
                    <TableCell>
                      <img src={category.image} alt={category.name} className="h-28 w-auto rounded-md" />
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button > */}

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500"
                          onClick={() => { setSelectedCategory(category), setOpenDelete(true) }}
                        >
                          {
                            statusFilter == 1 ? (<Trash2 className="h-4 w-4" />) : (<RotateCcw className="h-4 w-4" />
                            )
                          }
                        </Button>

                      </div>
                    </TableCell>


                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bạn chắc chắn muốn {statusFilter == 1 ? " xóa" : " khôi phục"} danh mục này?</DialogTitle>
                </DialogHeader>

                <DialogFooter>
                  <Button variant="secondary" onClick={() => setOpenDelete(false)}>
                    Hủy
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleConfirmCategory(selectedCategory.id, statusFilter == 1 ? 0 : 1)}
                  >
                    Xác nhận{statusFilter == 1 ? " xóa" : " khôi phục"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {
            categories.length > 0 &&
            <Pagination totalPages={pagination?.totalPages} onPageChange={setPageNow} currentPage={pageNow} />
          }
        </CardContent>
      </Card>
    </div>
  )
}

