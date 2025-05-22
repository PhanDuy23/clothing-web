import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { CreditCard, Plus, Trash2 } from "lucide-react"

export default function PaymentMethods() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Phương thức thanh toán</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm thẻ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm thẻ thanh toán</DialogTitle>
              <DialogDescription>Thêm thông tin thẻ thanh toán của bạn</DialogDescription>
            </DialogHeader>
            <form className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Số thẻ</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Ngày hết hạn</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">Mã bảo mật (CVV)</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên chủ thẻ</Label>
                <Input id="name" placeholder="NGUYEN VAN A" />
              </div>
              <div className="space-y-2">
                <Label>Đặt làm mặc định</Label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="default" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="default">Đặt làm phương thức thanh toán mặc định</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Lưu thẻ</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Thẻ Visa
                <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Mặc định</span>
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-1 text-sm">
              <p className="font-medium">**** **** **** 1234</p>
              <p className="text-muted-foreground">Hết hạn: 12/25</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Thẻ MasterCard
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-1 text-sm">
              <p className="font-medium">**** **** **** 5678</p>
              <p className="text-muted-foreground">Hết hạn: 08/26</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              Đặt làm mặc định
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phương thức thanh toán khác</CardTitle>
          <CardDescription>Các phương thức thanh toán khác được hỗ trợ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 flex items-center justify-center h-24">
              <img src="/placeholder.svg" alt="VNPAY" className="h-8" />
            </div>
            <div className="border rounded-lg p-4 flex items-center justify-center h-24">
              <img src="/placeholder.svg" alt="Momo" className="h-8" />
            </div>
            <div className="border rounded-lg p-4 flex items-center justify-center h-24">
              <img src="/placeholder.svg" alt="ZaloPay" className="h-8" />
            </div>
            <div className="border rounded-lg p-4 flex items-center justify-center h-24">
              <img src="/placeholder.svg" alt="COD" className="h-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

