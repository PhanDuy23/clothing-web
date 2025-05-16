import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { useState } from "react"
import { useAuth } from "../../redux/useAuth"
import { updateUser } from "../../services/users"

export default function PersonalInfor() {

  const {user} = useAuth()
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const {setUser} = useAuth()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const updatedInf = {
      fullName,
      email,
      phone,
      // Nếu có thêm dob, gender thì gộp vào đây
    };
    
    const {data, status, message} = await updateUser(user.id, updatedInf)
    if(status == 201){
      setUser(data)
      alert("Cập nhật thành công")
    }else{
      alert(message)
    }

    // Gọi API cập nhật user ở đây nếu cần
  };

  return (
    <div className="">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Họ tên</Label>
                <Input
                  id="firstName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Tên đăng nhập</Label>
                <p>{user?.userName}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="dob">Ngày sinh</Label>
              <Input id="dob" type="date" defaultValue={user.d} />
            </div>
            <div className="space-y-2">
              <Label>Giới tính</Label>
              <RadioGroup defaultValue="male" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Nam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Nữ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Khác</Label>
                </div>
              </RadioGroup>
            </div> */}
            <Button type="submit">Lưu thay đổi</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

