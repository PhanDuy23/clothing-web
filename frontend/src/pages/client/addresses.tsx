"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Home, Plus, Pencil, Trash2 } from "lucide-react"

// Sample data
const initialAddresses = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0912345678",
    address: "123 Đường Lê Lợi",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    isDefault: true,
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    phone: "0912345678",
    address: "456 Đường Nguyễn Huệ",
    ward: "Phường Bến Thành",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    isDefault: false,
  },
]

export default function Addresses() {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<any>(null)

  const handleAddAddress = (newAddress: any) => {
    setAddresses([...addresses, { ...newAddress, id: Date.now() }])
    setIsAddDialogOpen(false)
  }

  const handleEditAddress = (updatedAddress: any) => {
    setAddresses(addresses.map((address) => (address.id === updatedAddress.id ? updatedAddress : address)))
    setIsEditDialogOpen(false)
  }

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter((address) => address.id !== id))
  }

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Địa chỉ giao hàng</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm địa chỉ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm địa chỉ mới</DialogTitle>
              <DialogDescription>Vui lòng nhập thông tin địa chỉ giao hàng của bạn</DialogDescription>
            </DialogHeader>
            <AddressForm onSubmit={handleAddAddress} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Địa chỉ{" "}
                  {address.isDefault && (
                    <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Mặc định</span>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Dialog
                    open={isEditDialogOpen && currentAddress?.id === address.id}
                    onOpenChange={(open) => {
                      setIsEditDialogOpen(open)
                      if (!open) setCurrentAddress(null)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setCurrentAddress(address)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Chỉnh sửa địa chỉ</DialogTitle>
                        <DialogDescription>Cập nhật thông tin địa chỉ giao hàng của bạn</DialogDescription>
                      </DialogHeader>
                      {currentAddress && (
                        <AddressForm
                          initialData={currentAddress}
                          onSubmit={handleEditAddress}
                          onCancel={() => setIsEditDialogOpen(false)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(address.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-1 text-sm">
                <p className="font-medium">{address.name}</p>
                <p>{address.phone}</p>
                <p>{address.address}</p>
                <p>
                  {address.ward}, {address.district}
                </p>
                <p>{address.city}</p>
              </div>
            </CardContent>
            <CardFooter>
              {!address.isDefault && (
                <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)}>
                  Đặt làm mặc định
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AddressForm({ initialData, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      phone: "",
      address: "",
      ward: "",
      district: "",
      city: "",
      isDefault: false,
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ tên</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Tỉnh/Thành phố</Label>
            <Select value={formData.city} onValueChange={(value) => handleSelectChange("city", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn tỉnh/thành phố" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">Quận/Huyện</Label>
            <Select value={formData.district} onValueChange={(value) => handleSelectChange("district", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn quận/huyện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Quận 1">Quận 1</SelectItem>
                <SelectItem value="Quận 2">Quận 2</SelectItem>
                <SelectItem value="Quận 3">Quận 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ward">Phường/Xã</Label>
            <Select value={formData.ward} onValueChange={(value) => handleSelectChange("ward", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phường/xã" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Phường Bến Nghé">Phường Bến Nghé</SelectItem>
                <SelectItem value="Phường Bến Thành">Phường Bến Thành</SelectItem>
                <SelectItem value="Phường Đa Kao">Phường Đa Kao</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">Lưu địa chỉ</Button>
      </DialogFooter>
    </form>
  )
}

