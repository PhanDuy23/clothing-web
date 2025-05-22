import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Plus, Trash2, RotateCcw } from "lucide-react"
import Pagination from "../../components/layout/pagination"
import { getBanners, createBanner, deleteBanner} from "../../services/banners"
import { Link } from "react-router-dom"

interface Slide {
  id: number
  slug: string
  title: string
  image: string
  created_at: string
  updated_at: string
}

export default function SlideManagement() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [pageNow, setPageNow] = useState(1)
  const [limit] = useState(10)

  useEffect(() => {
    const fetchSlides = async () => {
      const  data  = await getBanners()
      if (data) {
        setSlides(data)
      } else {
        alert("Không thể tải danh sách slide")
      }
    }
    fetchSlides()
  }, [])

  const filteredSlides = slides.filter((slide) =>
    slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    slide.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    const { success, message } = await deleteBanner(id)
    if (success) {
      setSlides((prev) => prev.filter((s) => s.id !== id))
      alert("Xóa thành công")
    } else {
      alert(message || "Lỗi khi xóa slide")
    }
    setOpenDelete(false)
  }

  return (
    <div className="relative">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quản Lý Slide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-wrap gap-3">
            <Input
              placeholder="Tìm kiếm theo tiêu đề hoặc slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" size="sm" asChild>
              <Link to="create">
                <Plus className="mr-2 h-4 w-4" />
                Thêm slide
              </Link>
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead className="text-right">Chức năng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSlides.slice((pageNow - 1) * limit, pageNow * limit).map((slide) => (
                  <TableRow key={slide.id}>
                    <TableCell>{slide.id}</TableCell>
                    <TableCell>{slide.title}</TableCell>
                    <TableCell>{slide.slug}</TableCell>
                    <TableCell>
                      <img src={slide.image} alt={slide.title} className="h-24 w-auto rounded-md" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500"
                        onClick={() => { setSelectedSlide(slide); setOpenDelete(true) }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Dialog open={openDelete} onOpenChange={setOpenDelete}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bạn chắc chắn muốn xóa slide này?</DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setOpenDelete(false)}>Hủy</Button>
                <Button variant="destructive" onClick={() => handleDelete(selectedSlide!.id)}>Xác nhận xóa</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {slides.length > limit && (
            <Pagination
              totalPages={Math.ceil(filteredSlides.length / limit)}
              onPageChange={setPageNow}
              currentPage={pageNow}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
