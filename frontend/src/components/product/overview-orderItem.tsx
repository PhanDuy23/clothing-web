"use client"

import { Card } from "../ui/card"
import { OrderItemType } from "../../type"
import { formatPrice } from "../../pages/client/complete-order"
import { X } from 'lucide-react';
import { Input } from "../ui/input";
import { useState } from "react";

export default function OverviewOrderItem({ item, handleRemoveItem, handleCheckBox }: { item: OrderItemType, handleRemoveItem?: (id: number) => void, handleCheckBox?: (checked: boolean, id: number) => void }) {
    const [checked, setChecked] = useState(true)
    return (
        <Card className="relative p-4"  >
            <div className="relative flex flex-col sm:flex-row gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                    <img
                        src={item.image}
                        alt={`Product ${item.productId}`}

                        className="object-cover"
                    />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                    <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Size: {item.size}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Color: {item.color}
                        </p>

                        <span className="w-12 text-center mt-1 text-sm text-muted-foreground">{`Số lượng: ${item.quantity}`}</span>

                        <p className="mt-1  font-medium mt-1 text-sm text-muted-foreground"> {formatPrice(item.price)}</p>
                    </div>
                </div>
                <div className="text-right  font-medium pt-3 sm:mt-0">{formatPrice(item.price * item.quantity)}</div>
            </div>
            {handleRemoveItem && <button
                className="absolute top-1 right-1 w-6 h-6 bg-white  text-black  flex items-center justify-center hover:opacity-50"
                onClick={() => handleRemoveItem(item.id)}
                aria-label="Xóa sản phẩm"
            >
                <X size={14} />
            </button>}
            {handleCheckBox && <Input type="checkbox"
                className="absolute top-1 left-1 w-3 h-3 bg-white  text-black  flex items-center justify-center hover:opacity-50"
                checked={checked}
                onChange={(e) => {
                    const isChecked = e.target.checked;
                    setChecked(isChecked);
                    handleCheckBox(isChecked, item.id);


                }
                }
                aria-label="Xóa sản phẩm"

            />}
        </Card>
    )
}

