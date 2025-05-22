import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { Shield, Smartphone } from "lucide-react"

export default function Security() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
          <CardDescription>Cập nhật mật khẩu của bạn để bảo vệ tài khoản</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button type="submit">Cập nhật mật khẩu</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Xác thực hai yếu tố</CardTitle>
          <CardDescription>Tăng cường bảo mật cho tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Bảo mật tài khoản</AlertTitle>
              <AlertDescription>
                Xác thực hai yếu tố giúp bảo vệ tài khoản của bạn ngay cả khi mật khẩu bị lộ.
              </AlertDescription>
            </Alert>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Xác thực qua SMS</p>
                <p className="text-sm text-muted-foreground">Nhận mã xác thực qua tin nhắn SMS</p>
              </div>
              <Button variant="outline">Thiết lập</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ứng dụng xác thực</p>
                <p className="text-sm text-muted-foreground">Sử dụng ứng dụng xác thực như Google Authenticator</p>
              </div>
              <Button variant="outline">Thiết lập</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phiên đăng nhập</CardTitle>
          <CardDescription>Quản lý các thiết bị đang đăng nhập vào tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">iPhone 13 Pro</p>
                  <p className="text-sm text-muted-foreground">Hà Nội, Việt Nam • Hiện tại</p>
                </div>
              </div>
              <p className="text-sm text-green-600 font-medium">Thiết bị hiện tại</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">Windows PC</p>
                  <p className="text-sm text-muted-foreground">Hà Nội, Việt Nam • 2 ngày trước</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Đăng xuất
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

