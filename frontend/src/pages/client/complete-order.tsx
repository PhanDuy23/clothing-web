"use client"

import { Home, ShoppingCart, ShoppingCartIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { number, z } from "zod"
import { useEffect, useState } from "react"

import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { getDistricts, getProvinces, getShippingFee, getWards } from "../../services/shipping"
import useOrder from "../../redux/useOrder"
import OverviewOrderItem from "../../components/product/overview-orderItem"
import type { OrderItemType } from "../../type"
import { Textarea } from "../../components/ui/textarea"
import { createOrder } from "../../services/order"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../redux/useAuth"

interface Province {
  ProvinceID: number
  ProvinceName: string
}

interface District {
  DistrictID: number
  DistrictName: string
}

interface Ward {
  WardCode: string
  WardName: string
}

interface Address {
  id: number;
  name: string;
}


const formSchema = z.object({

  name: z.string().min(1, "Họ và tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  ward: z.string().min(1, "Vui lòng chọn phường/xã"),
  provinceName: z.string().min(1, "Vui lòng chọn tỉnh/thành"),
  districtName: z.string().min(1, "Vui lòng chọn quận/huyện"),
  wardName: z.string().min(1, "Vui lòng chọn phường/xã"),
  note: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank"]),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  bankName: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === "bank") {
    return !!data.accountNumber && !!data.accountName && !!data.bankName;
  }
  return true;
}, {
  message: "Số tài khoản, tên tài khoản và ngân hàng là bắt buộc khi chọn chuyển khoản",
  path: ["accountNumber"]
});

export const calculateTotalPrice = (items: OrderItemType[], shippingFee?: number): number => {
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)
  return shippingFee ? totalPrice + shippingFee : totalPrice
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)
}

export function CompleteOrder() {
  const { user } = useAuth()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: "",
      province: "",
      district: "",
      wardName: "",
      provinceName: "",
      districtName: "",
      ward: "",
      note: "",
      paymentMethod: "cod",
      accountNumber: "",
      accountName: "",
      bankName: "",
    },
  })

  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [shippingFee, setShippingFee] = useState<number>(0)
  const orderItems = useOrder((state) => state.orderItems);

  const navigate = useNavigate()

  const paymentMethod = form.watch("paymentMethod")
  const handleCompleteOrder = async (order: any) => {

    const orderInf = {
      ...order,
      userId: user?.id,
      status: "pending",
      paymentStatus: "pending",
      shippingFee: 0,
      discount: 0,
      total: 0,
    }
    orderInf.shippingFee = shippingFee
    orderInf.total = calculateTotalPrice(orderItems, shippingFee)
    if (order.paymentMethod == "bank") {
      orderInf.paymentStatus = "paid"
    }
    console.log("Form đã được gửi thành công!", orderInf)
    const {data, success, message} = await createOrder(orderInf, orderItems);
    console.log("orderId:", data);
    if (success)
      navigate(`/order-confirmtion/${data}`, { state: { orderInf, orderItems } }); 
    else {
      alert(message)
    }
    // Xử lý dữ liệu form ở đây

  }





  useEffect(() => {
    async function fetchProvinces() {
      const data = await getProvinces()
      setProvinces(data.data)
    }
    fetchProvinces()
  }, [])

  const handleProvinceChange = async (value: Address) => {
    form.setValue("province", String(value.id))
    form.setValue("provinceName", value.name)
    setDistricts([])
    setWards([])
    const data = await getDistricts(Number(value.id))
    setDistricts(data.data)

  }

  const handleDistrictChange = async (value: Address) => {
    form.setValue("district", String(value.id))
    form.setValue("districtName", String(value.name))
    setWards([])

    const data = await getWards(Number(value.id))
    setWards(data.data)

  }

  const handleWardChange = async (value: Address) => {
    form.setValue("ward", String(value.id))
    form.setValue("wardName", value.name)
    const data = await getShippingFee({
      to_district_id: Number(form.getValues("district")),
      to_ward_code: String(value.id),
      weight: orderItems.length * 300,
    })
    setShippingFee(data.data.total)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              {orderItems.map((item) => (

                <OverviewOrderItem item={item} key={item.id || item.price} />

              ))}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng</span>
                  <span>{formatPrice(calculateTotalPrice(orderItems))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee ? formatPrice(shippingFee) : "-"}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Tổng cộng</span>
                  <span className="text-lg">VND {formatPrice(calculateTotalPrice(orderItems, shippingFee))}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex justify-center">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit((data) => {
                  handleCompleteOrder(data)
                })(e)
              }}
              className="space-y-6 w-[80%]"
            >
              <div className="space-y-4">
                <h2 className="font-bold text-2xl">Thông tin giao hàng</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Họ và tên" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Số điện thoại" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input placeholder="Địa chỉ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tỉnh / thành</FormLabel>
                          <Select onValueChange={(value) => {
                            const selectedProvince = provinces.find(province => province.ProvinceID == Number(value));
                            if (selectedProvince) {
                              handleProvinceChange({
                                id: selectedProvince.ProvinceID,
                                name: selectedProvince.ProvinceName
                              });
                            }
                          }} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn tỉnh/thành" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem key={province.ProvinceID} value={String(province.ProvinceID)}>
                                  {province.ProvinceName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quận / huyện</FormLabel>
                          <Select onValueChange={(value) => {
                            // Lấy thông tin quận/huyện từ `districts` dựa trên `DistrictID`
                            const selectedDistrict = districts.find(district => district.DistrictID == Number(value));
                            if (selectedDistrict) {
                              handleDistrictChange({
                                id: selectedDistrict.DistrictID,
                                name: selectedDistrict.DistrictName
                              });
                            }
                          }} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn quận/huyện" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {districts.map((district) => (
                                <SelectItem key={district.DistrictID} value={String(district.DistrictID)}>
                                  {district.DistrictName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ward"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phường / xã</FormLabel>
                          <Select onValueChange={(value) => {
                            const selectedWard = wards.find(ward => ward.WardCode == String(value));
                            if (selectedWard) {
                              handleWardChange({
                                id: Number(selectedWard.WardCode),
                                name: selectedWard.WardName
                              });
                            }
                          }} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn phường/xã" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {wards.map((ward) => (
                                <SelectItem key={ward.WardCode} value={ward.WardCode}>
                                  {ward.WardName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-semibold">Phí vận chuyển</h2>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">
                    {shippingFee ? `${formatPrice(shippingFee)}` : "Vui lòng chọn tỉnh / thành"}
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <h2 className="font-semibold">Phương thức thanh toán</h2>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod">Thanh toán khi giao hàng (COD)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank">Chuyển khoản ngân hàng</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {paymentMethod === "bank" && (
                <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                  <h3 className="font-medium">Thông tin tài khoản ngân hàng</h3>

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Số tài khoản <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập số tài khoản" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên chủ tài khoản</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên chủ tài khoản" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên ngân hàng</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên ngân hàng" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ghi chú" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between pt-6">
                <Link to={"/shopping-cart"} className="flex items-center text-blue-600">
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  <span> Giỏ hàng</span>
                </Link>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Hoàn tất đơn hàng
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

