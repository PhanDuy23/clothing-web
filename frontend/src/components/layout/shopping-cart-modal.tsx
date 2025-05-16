"use client"

import {  useEffect, useState } from "react"
import { X, ShoppingCart } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { OrderItemType, UserType } from "../../type"
import OverviewOrderItem from "../product/overview-orderItem"
import { calculateTotalPrice, formatPrice } from "../../pages/client/complete-order"
import useOrder from "../../redux/useOrder"
import useShoppingCart from "../../redux/useShoppingCart"
import { getCartItems } from "../../services/carts"


interface props {
    isOpen: boolean,
    onClose: () => void
    user: UserType|null
}

export default function ShoppingCartModal({ isOpen, onClose, user }: props) {
    const {setCart, cart, remove} = useShoppingCart()
    const [cartItems, setCartItems] = useState<OrderItemType[]>(cart) // danh sách selected 
    const { setOrder } = useOrder()
    const navigate = useNavigate()

    useEffect(() => {
        if(user){
          const getAllCarts = async () => {
            if (user) {
              const { data, success, message } = await getCartItems(user.id)
              if (success) {
                setCart(data)
                setCartItems(data) 
              } else {
                alert(message)
              }
            }
          }
          getAllCarts()
        }else{
          setCart([])
        }
      }, [user]);

    const handleBuyNow = () => {
        setOrder(cartItems)
        navigate("/complete-order")
        onClose()
    }

    const handleRemoveItem = (id: number) => {
        setCartItems(cartItems.filter((item) => item.id !== id))
        remove(id)
    }

    const handleCheckBox = (checked: boolean, id: number) => {
        if (checked) {
            // Tìm sản phẩm trong danh sách gốc
            const itemToAdd = cart.find((item) => item.id === id);
            if (itemToAdd && !cartItems.some((item) => item.id === id)) {
                setCartItems([...cartItems, itemToAdd]); // thêm sản phẩm
            }
        } else {
            // Bỏ sản phẩm ra khỏi cart
            setCartItems(cartItems.filter((item) => item.id !== id));

        }

    }


    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center z-50" onClick={onClose}>
            <div className="bg-white w-full max-w-lg h-full rounded shadow-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Giỏ hàng của tôi</h2>
                    <button className="p-1 hover:bg-gray-100 rounded-full" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <br />

                {/* Cart Items */}
                <div className="overflow-x-auto w-full h-full space-y-4 p-4">
                    {cart.map((item) => (
                        <OverviewOrderItem item={item} key={item.id || item.price} handleCheckBox={handleCheckBox} handleRemoveItem={handleRemoveItem} />
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="p-4 ">
                    {/* Total Amount */}
                    <div className="flex justify-between items-center mb-4 font-semibold">
                        <span>TỔNG TIỀN:</span>
                        <span className="text-xl text-red-600">{formatPrice(calculateTotalPrice(cartItems))}</span>
                    </div>

                    {/* Checkout Button */}
                    <Button className="w-full py-3 bg-green-600 text-white font-semibold rounded mb-4 hover:bg-green-700" onClick={handleBuyNow}>
                        THANH TOÁN NGAY

                    </Button>

                    {/* Cart Actions */}
                    <div className="flex justify-between text-sm">
                        <Link to={"/shopping-cart"} className="flex items-center text-blue-600" onClick={onClose}>
                            <ShoppingCart className="w-6 h-6 mr-2" />
                            <span>{"Giỏ hàng"}</span>
                        </Link>
                        {/* <Link to="#" className="text-blue-600 hover:underline">
                            Khuyến mãi dành cho bạn
                        </Link> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

