import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Plus, Trash2, Edit, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Category, Product } from "../../type"
import { buildCategoryTree, getCategories } from "../../services/categories"
import { getProductsByCategory, updateProduct } from "../../services/products"
import Pagination from "../../components/layout/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Link } from "react-router-dom"
import { formatPrice } from "../../components/product/overview-product"
export function ProductsManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [categorySelected, setCategorySelected] = useState<number>("all")
    const [selectedProduct, setSelectedProduct] = useState<number>();
    const [openDelete, setOpenDelete] = useState(false);
    const [statusFilter, setStatusFilter] = useState<number>(1)
    const [pagination, setPagination] = useState();               // phân trang  
    const [pageNow, setPageNow] = useState(1);
    const limit = 9;


    useEffect(() => {
        const getListCategories = async () => {
            const { categories } = await getCategories({ limit: 100, page: pageNow, status: 1 })
            if (categories) {
                setCategories(categories)
            }
        }
        getListCategories()
    }, []);

    useEffect(() => {

        const fetchProducts = async () => {
            const data = await getProductsByCategory(categorySelected, limit, pageNow, statusFilter);
            setProducts(data.products);
            setPagination(data.pagination)
            console.log(data.pagination);

        };

        fetchProducts();
    }, [categorySelected, pageNow, limit, statusFilter]); // Chạy lại khi categorySlug thay đổi

    const productsFilter = products
        .filter(
            (product) =>
            (String(product.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(product.id).toLowerCase().includes(searchQuery.toLowerCase()))
        )
    const handleConfirmProduct = async (productId: number, status: number) => {
        setOpenDelete(false)
        const { success, message } = await updateProduct(productId, { status })
        if (success) {
            const productsNew = products.filter(product => product.id !== productId);
            setProducts(productsNew)
            alert(`${statusFilter == 1 ? "Xóa" : "Khôi phục"} thành công`)
        } else {
            alert(message)
        }
    }
    return (
        <div className="relative">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Quản Lý Sản phẩm</CardTitle>
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
                                    Thêm Sản Phẩm
                                </Link>

                            </Button>
                        </div>
                        <Select value={categorySelected} onValueChange={setCategorySelected}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Danh mục sản phẩm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key={"all"} value={"all"}>
                                    {"Tất cả"}
                                </SelectItem>
                                {categories &&
                                    categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))
                                }


                            </SelectContent>
                        </Select>
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
                    <div className="border rounded-lg overflow-auto w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã</TableHead>
                                    <TableHead>Tên sản phẩm</TableHead>
                                    <TableHead>Số lượng</TableHead>
                                    <TableHead>Hình ảnh</TableHead>
                                    <TableHead>Giá tiền</TableHead>
                                    <TableHead className="text-right">Chức năng</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productsFilter.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product?.quantity||0}</TableCell>
                                        <TableCell>
                                            <img src={product.thumbnail} alt={product.name} className="h-28 w-auto rounded-md" />
                                        </TableCell>
                                        <TableCell>{formatPrice(product.price) } </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                                                    <Link
                                                        to="update"
                                                        state={{ categories, productSlug: product.slug, isEditMode: true }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>

                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-red-500"
                                                    onClick={() => { setSelectedProduct(product.id), setOpenDelete(true) }}
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
                                            onClick={() => handleConfirmProduct(selectedProduct, statusFilter == 1 ? 0 : 1)}
                                        >
                                            Xác nhận{statusFilter == 1 ? " xóa" : " khôi phục"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </Table>
                    </div>
                    {
                        productsFilter.length > 0 &&
                        <Pagination totalPages={pagination?.totalPages} onPageChange={setPageNow} currentPage={pageNow} />
                    }
                </CardContent>
            </Card>
        </div>
    )
}

