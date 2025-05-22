"use client"

import * as React from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { useForm } from "react-hook-form"
import  { useAuth } from "../../redux/useAuth"
import { useLocation, useNavigate } from "react-router-dom"

export function LoginForm() {
    const [error, setError] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const {login} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const form = useForm({
        defaultValues: {
            userName: "",
            password: "",
        },
    })

// Lấy trang trước đó mà người dùng đã cố gắng truy cập
  const state = location.state 
  const from = state?.from?.pathname || "/"

    const onSubmit = async (data: any) => {
        setError("")
        try {
            const{status, user, message } = await login(data.userName, data.password)
            // Chuyển hướng người dùng về trang họ đã cố gắng truy cập 
            if(status == 200){
                if(user.role == "customer") navigate(from, { replace: true })
                else navigate("/admin")
            }
            
          } catch (err) {
            setError("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập.")
          }
    }

    return (
        <div>
            <div className="mx-auto max-w-[600px] p-6">
            <h1 className="text-center text-3xl font-bold mb-7">Đăng nhập</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên Đăng Nhập</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tên đăng nhập" {...field} />
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
                        {error && <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}
                        <Button type="submit" className="w-full">
                            ĐĂNG NHẬP
                        </Button>

                        <div className="text-center text-sm">
                            {/* <Link href="#" className="text-blue-600 hover:underline">
                                Quên mật khẩu?
                            </Link> */}
                        </div>

                        <div className="text-center text-sm">
                            Chưa có tài khoản?{" "}
                            <Link href="/register" className="text-blue-600 hover:underline">
                                Đăng ký ngay
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

