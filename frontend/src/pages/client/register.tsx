"use client"

import Link from "next/link"
import { CalendarIcon, Eye, EyeOff } from "lucide-react"
import { format, parse, isValid } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { useForm } from "react-hook-form"
import { registerUser } from "../../services/users"
import { useAuth } from "../../redux/useAuth"
import { useNavigate } from "react-router-dom"

const formSchema = z.object({
  fullName: z.string().min(1, "Họ là bắt buộc"),
  userName: z.string().min(1, "Tên là bắt buộc"),
  // gender: z.enum(["female", "male"], {
  //   required_error: "Vui lòng chọn giới tính",
  // }),
  // birthDate: z.date({
  //   required_error: "Ngày sinh là bắt buộc",
  //   invalid_type_error: "Định dạng ngày sinh không hợp lệ",
  // }),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(8,"Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt",
  // ),
})

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [dateInputValue, setDateInputValue] = useState("")
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      userName: "",
      // gender: "",
      // birthDate: undefined,
      email: "",
      password: "",
      phone: ""
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data)
    const { status, user, message } = await registerUser(data)
    if (status != 201) {
      if (status == 400) {
        alert(message)
      } else {
        console.log(message);

      }
    } else {
      setUser(user)
      alert("tạo thành công")
      navigate("/login")
    }

  }

  return (
    <div className="mx-auto max-w-[600px] p-6">
      <h1 className="text-center text-3xl font-bold mb-7">Đăng kí</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
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

            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên tài khoản" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <label htmlFor="female">Nữ</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <label htmlFor="male">Nam</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <div className="flex">
                        <Input
                          placeholder="dd/MM/yyyy"
                          value={dateInputValue}
                          onChange={(e) => {
                            setDateInputValue(e.target.value)
                            const parsedDate = parse(e.target.value, "dd/MM/yyyy", new Date())
                            if (isValid(parsedDate)) {
                              field.onChange(parsedDate)
                            }
                          }}
                          className="rounded-r-none"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className={cn("rounded-l-none border-l-0", !field.value && "text-muted-foreground")}
                        >
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </div>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        if (date) {
                          setDateInputValue(format(date, "dd/MM/yyyy"))
                        }
                      }}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
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
                  <Input placeholder="Số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="Mật khẩu" {...field} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            ĐĂNG KÝ
          </Button>

          <div className="text-center text-sm">
            Bạn đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}

