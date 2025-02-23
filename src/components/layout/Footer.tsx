import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export default function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* TORANO Men's Fashion */}
          <div>
            <h3 className="text-red-600 font-semibold text-lg mb-4">Thời trang nam 1996 STORE</h3>
            <p className="text-gray-600 mb-6">
              Hệ thống thời trang cho phái mạnh hàng đầu Việt Nam, hướng tới phong cách nam tính, lịch lãm và trẻ trung.
            </p>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Youtube size={20} />
              </a>
            </div>
            <h4 className="font-semibold mb-4">Phương thức thanh toán</h4>
            <div className="grid grid-cols-3 gap-4">
              {/* <img src="/placeholder.svg" alt="VNPAY" className="h-8" />
              <img src="/placeholder.svg" alt="ZaloPay" className="h-8" />
              <img src="/placeholder.svg" alt="Moca" className="h-8" />
              <img src="/placeholder.svg" alt="Kredivo" className="h-8" />
              <img src="/placeholder.svg" alt="Napas" className="h-8" />
              <img src="/placeholder.svg" alt="Visa" className="h-8" /> */}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-red-600 font-semibold text-lg mb-4">Thông tin liên hệ</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Địa chỉ:</p>
                <p className="text-gray-600">Tầng 8, tòa nhà Ford, số 313 Trường Chinh, quận Thanh Xuân, Hà Nội</p>
              </div>
              <div>
                <p className="font-semibold">Điện thoại:</p>
                <p className="text-gray-600">0964942121</p>
              </div>
              <div>
                <p className="font-semibold">Fax:</p>
                <p className="text-gray-600">0904636356</p>
              </div>
              <div>
                <p className="font-semibold">Email:</p>
                <p className="text-gray-600">cskh@torano.vn</p>
              </div>
            </div>
            <h4 className="font-semibold mt-6 mb-4">Phương thức vận chuyển</h4>
            <div className="grid grid-cols-4 gap-4">
              {/* <img src="/placeholder.svg" alt="GHN" className="h-8" />
              <img src="/placeholder.svg" alt="Ninja Van" className="h-8" />
              <img src="/placeholder.svg" alt="Ahamove" className="h-8" />
              <img src="/placeholder.svg" alt="J&T Express" className="h-8" /> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-red-600 font-semibold text-lg mb-4">Nhóm liên kết</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Tìm kiếm
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-red-600 font-semibold text-lg mb-4">Đăng ký nhận tin</h3>
            <p className="text-gray-600 mb-4">
              Để cập nhật những sản phẩm mới, nhận thông tin ưu đãi đặc biệt và thông tin giảm giá khác.
            </p>
            <div className="flex gap-2 mb-6">
              <Input type="email" placeholder="Nhập email của bạn" className="flex-1" />
              <Button className="bg-red-600 hover:bg-red-700 text-white">ĐĂNG KÝ</Button>
            </div>
            {/* <img src="placeholder.svg" alt="Đã thông báo Bộ Công Thương" className="h-16" /> */}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600 text-sm mt-16 pt-8 border-t">
          Copyright © 2025 1996 STORE. Powered by Ruys
        </div>
      </div>
    </footer>
  )
}

