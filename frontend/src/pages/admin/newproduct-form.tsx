"use client"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { addProduct, getProductDetail, updateProduct } from "../../services/products"
import { useLocation } from "react-router-dom"

export function ProductForm() {
  // State for form fields
  const location = useLocation()
  const { isEditMode, categories, productSlug } = location.state
  const isInitialRender = useRef(true)
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    slug: "",
    sku: "",
    price: 0,
    originalPrice: 0,
    cost: 0,
    detailDescription: "",
    shortDescription: "",
    categoryId: "",
    weight: 0,
    status: 1,
    discount: 0,
    imageUrls: [] as string[],
    images: [] as File[],
    attributes: [{ color: "", size: "", quantity: 0 }],
  })
  const [originalData, setOriginalData] = useState()

  // Load existing product data when in edit mode
  useEffect(() => {
    let isMounted = true

    const getData = async () => {
      if (!productSlug) return

      try {
        const data = await getProductDetail(productSlug)
        if (data && isMounted) {
          console.log("API data received:", data)

          // Ensure all values are in the correct format
          const formattedData = {
            id: data.id || 0,
            name: data.name || "",
            slug: data.slug || "",
            sku: data.sku || "",
            price: data.price || 0,
            originalPrice: data.originalPrice || 0,
            cost: data.cost || 0,
            detailDescription: data.detailDescription || "",
            shortDescription: data.shortDescription || "",
            categoryId: data.categoryId ? data.categoryId.toString() : "",
            weight: data.weight || 0,
            status: data.status !== undefined ? data.status : 1,
            discount: data.discount || 0,
            imageUrls: data.images || [],
            images: [],
            attributes:
              data.attributes?.length > 0
                ? data.attributes.map((attr) => ({
                  color: attr.color || "",
                  size: attr.size || "",
                  quantity: attr.quantity || 0,
                }))
                : [{ color: "", size: "", quantity: 0 }],
          }

          setFormData(formattedData)
          setOriginalData(formattedData)
        }
      } catch (error) {
        console.error("Error fetching product data:", error)
        if (isMounted) {
          alert("Lỗi khi lấy dữ liệu sản phẩm")
        }
      }
    }

    if (isEditMode && productSlug && isInitialRender.current) {
      isInitialRender.current = false
      getData()
    }

    return () => {
      isMounted = false
    }
  }, [productSlug, isEditMode])

  // Handle text input changes
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  // Handle select changes - improved version
  const handleSelectChange = useCallback((name: string, value: string) => {
    console.log(`Select change: ${name} = ${value}`)

    setFormData((prev) => {
      // Only update if the value is actually different
      if (prev[name] === value) return prev

      return {
        ...prev,
        [name]: value,
      }
    })
  }, [])

  // Handle image upload
  const handleImagesUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }))
    }
  }, [])

  // Handle attribute change - improved version
  const handleAttributeChange = useCallback((index: number, field: string, value: string | number) => {
    setFormData((prev) => {
      const currentValue = prev.attributes[index]?.[field]

      // Only update if the value is actually different
      if (currentValue === value) return prev

      const updatedAttributes = [...prev.attributes]
      updatedAttributes[index] = {
        ...updatedAttributes[index],
        [field]: value,
      }

      return {
        ...prev,
        attributes: updatedAttributes,
      }
    })
  }, [])

  const addAttribute = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { color: "", size: "", quantity: 0 }],
    }))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const updatedFields: Partial<typeof formData> = {}
    formData.images.slice(0, 7 - formData.imageUrls.length)
    
    // So sánh từng trường với dữ liệu gốc
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof typeof formData
      if (
        JSON.stringify(formData[typedKey]) !==
        JSON.stringify(originalData?.[typedKey])
      ) {
        updatedFields[typedKey] = formData[typedKey]
      }
    })

    // Gộp dữ liệu gửi lên
    const productData = {
      id: formData.id,
      ...updatedFields,
      imageUrls: formData.imageUrls

    }

    console.log("Form data to submit:", productData)

    let result

    if (isEditMode) {
      // Update product, chỉ gửi các trường đã thay đổi
      result = await updateProduct(productData.id, productData)
    } else {
      // Tạo mới, chỉ cho phép tối đa 6 ảnh
      result = await addProduct(productData, formData.images.slice(0, 6 - formData.imageUrls.length))
    }


    if (result.success) {
      alert(result.message)
      if (!isEditMode) {
        // Only reset form when creating a new product
        // setFormData({
        //   id: 0,
        //   name: "",
        //   slug: "",
        //   sku: "",
        //   price: 0,
        //   originalPrice: 0,
        //   cost: 0,
        //   detailDescription: "",
        //   shortDescription: "",
        //   categoryId: "",
        //   weight: 0,
        //   status: 1,
        //   discount: 0,
        //   imageUrls: [],
        //   images: [],
        //   attributes: [{ color: "", size: "", quantity: 0 }],
        // })
      }
    } else {
      alert(result.message)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">{isEditMode ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm"}</h1>
      <form onSubmit={handleSubmit} className="py-4">
        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium">Tên sản phẩm</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="ten-san-pham"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">SKU</label>
                <Input name="sku" value={formData.sku} onChange={handleInputChange} placeholder="SP001" required />
              </div>
              <div>
                <label className="text-sm font-medium">Mô tả ngắn</label>
                <Input
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả ngắn"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="spacey">
                <label className="text-sm font-medium">Giá bán</label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Nhập giá bán"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Giá gốc</label>
                <Input
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="Nhập giá gốc"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Giá vốn</label>
                <Input
                  name="cost"
                  type="number"
                  value={formData.cost}
                  onChange={handleInputChange}
                  placeholder="Nhập giá vốn"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Giảm giá (%)</label>
                <Input
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="Nhập % giảm giá"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cân nặng (gram)</label>
                <Input
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="Nhập cân nặng"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Trạng thái</label>
                <Select
                  value={formData.status.toString()}
                  onValueChange={(value) => handleSelectChange("status", value)}
                  defaultValue="1"
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue className="bg-white" placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="bg-white" value="1">
                      Đang bán
                    </SelectItem>
                    <SelectItem value="0">Ngừng bán</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Danh mục</label>
                <Select
                  value={formData.categoryId.toString()}
                  onValueChange={(value) => handleSelectChange("categoryId", value)}
                  required
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories &&
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Mô tả chi tiết</label>
              <textarea
                name="detailDescription"
                value={formData.detailDescription}
                onChange={handleInputChange}
                className="min-h-[100px] w-full resize-none rounded-md border border-input bg-white px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Nhập mô tả chi tiết sản phẩm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Ảnh sản phẩm (tối đa 6 ảnh) </label>
            <p className="text-sm">ảnh đầu tiên là ảnh đại diện</p>
            <div className="mt-2 flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("product-images")?.click()}
              >
                Chọn ảnh
              </Button>
              <input
                id="product-images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImagesUpload}
              />
              <span className="text-sm text-muted-foreground">
                {formData.images.length > 0 ? `${formData.images.length} ảnh đã chọn` : "Chưa có ảnh nào"}
              </span>
            </div>

            {/* Display existing images */}
            {/* {isEditMode && formData.imageUrls.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Ảnh hiện tại:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.imageUrls.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative h-20 w-20 rounded border">
                      <div className="h-full w-full overflow-hidden rounded">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Existing ${idx}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display newly selected images */}
            {/* {formData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">{isEditMode ? "Ảnh mới:" : "Ảnh đã chọn:"}</p>
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((img, idx) => (
                    <div key={`new-${idx}`} className="relative h-20 w-20 rounded border">
                      <div className="h-full w-full overflow-hidden rounded">
                        <img
                          src={URL.createObjectURL(img) || "/placeholder.svg"}
                          alt={`Preview ${idx}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}  */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Ảnh sản phẩm:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  ...formData.imageUrls.map((url, idx) => ({ type: 'existing', url, index: idx })),
                  ...formData.images.map((file, idx) => ({ type: 'new', url: URL.createObjectURL(file), index: idx })),
                ]
                  // .slice(0, 6) // Giới hạn tối đa 6 ảnh
                  .map((img) => (
                    <div key={`${img.type}-${img.index}`} className="relative h-28 w-28 rounded border">
                      <div className="h-full w-full overflow-hidden rounded">
                        <img
                          src={img.url}
                          alt={`Ảnh ${img.index}`}
                          className="h-28 w-28 object-cover"
                        />
                      </div>

                      {/* Nút xóa ảnh */}
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 text-black rounded-full bg-white w-3 h-3 text-xs flex items-center justify-center"
                        onClick={() => {
                          if (img.type === 'existing') {
                            setFormData((prev) => ({
                              ...prev,
                              imageUrls: prev.imageUrls.filter((_, i) => i !== img.index),
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== img.index),
                            }));
                          }
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>

          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Thuộc tính sản phẩm (màu sắc, kích thước, số lượng)</label>
              <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                Thêm thuộc tính
              </Button>
            </div>

            {formData.attributes.map((attr, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-md">
                <div>
                  <label className="text-xs font-medium">Màu sắc</label>
                  <Input
                    value={attr.color}
                    onChange={(e) => handleAttributeChange(index, "color", e.target.value)}
                    placeholder="Màu sắc"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Kích thước</label>
                  <Input
                    value={attr.size}
                    onChange={(e) => handleAttributeChange(index, "size", e.target.value)}
                    placeholder="Kích thước"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Số lượng</label>
                  <Input
                    type="number"
                    value={attr.quantity}
                    onChange={(e) => handleAttributeChange(index, "quantity", Number.parseInt(e.target.value) || 0)}
                    placeholder="Số lượng"
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-right">
          <Button type="submit" className="mt-6 text-right">
            {isEditMode ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm"}
          </Button>
        </div>
      </form>
    </div>
  )
}
