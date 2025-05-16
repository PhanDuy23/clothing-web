"use client"

import { useState, useEffect, useRef } from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "../../lib/utils"

interface PriceRangeSliderProps {
  min: number
  max: number
  step?: number
  defaultValue?: [number, number]
  value?: [number, number]
  onValueChange?: (value: [number, number]) => void
  formatValue?: (value: number) => string
  className?: string
}

export function Slider({
  min,
  max,
  step = 1000,
  defaultValue = [min, max],
  value,
  onValueChange,
  formatValue = (value) => `${value.toLocaleString()}đ`,
  className,
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value || defaultValue)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : localValue

  const thumbRefs = useRef<(HTMLSpanElement | null)[]>([null, null])

  useEffect(() => {
    if (isControlled && value) {
      setLocalValue(value)
    }
  }, [isControlled, value])

  const handleValueChange = (newValue: [number, number]) => {
    if (!isControlled) {
      setLocalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <div className={cn("w-full px-2 pt-8 pb-6", className)}>
      <div className="relative">
        <SliderPrimitive.Root
          className="relative flex w-full touch-none select-none items-center"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onValueChange={handleValueChange}
          onValueCommit={() => setIsDragging(false)}
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
            <SliderPrimitive.Range className="absolute h-full bg-black" />
          </SliderPrimitive.Track>

          {[0, 1].map((index) => (
            <SliderPrimitive.Thumb
              key={index}
              ref={(el) => (thumbRefs.current[index] = el)}
              className="block h-5 w-5 rounded-full border-2 border-white bg-black shadow-md ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
            />
          ))}
        </SliderPrimitive.Root>
      </div>

      {/* Min and max labels */}
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        {/* <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span> */}
        <span>{formatValue(currentValue[0])}</span>
        <span>{formatValue(currentValue[1])}</span>
      </div>
    </div>
  )
}
