"use client"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { Category } from "../../type"
import { addCategory, getCategories } from "../../services/categories"

export function NewCategoryForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<{
    name: string
    parentId: number
    description: string
    slug: string
    image: File | null
  }>({
    name: "",
    parentId: 0,
    description: "",
    slug: "",
    image: null,
  })
  useEffect(() => {
    const getListCategories = async () => {
      const { categories, message } = await getCategories({
        limit: 100,
        page: 1,
        status: 1,
        parentId: "0"
      })
      if (categories) {
        setCategories(categories)
      } else {
        alert(message)
      }
    }
    getListCategories()
  }, [])
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

  }

  const handleSelectChange = (name: string, value: String) => {
    setFormData({
      ...formData,
      [name]: value,
    })
    
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      })
    }
  }

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault()
    console.log("Category data submitted:", formData)
    if (formData.image) {
      const { success, message } = await addCategory(formData)
      if (success) {
        alert(message)
        setFormData({
          name: "",
          parentId: 0,
          description: "",
          slug: "",
          image: null,
        })
      } else {
        alert(message)
      }
    } else {
      alert("Hãy chọn ảnh đại diện cho danh mục")
    }

  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Thêm Danh Mục Sản Phẩm</h1>
      <form onSubmit={handleAddCategory} className="p-6">
        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tên danh mục</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Áo sơ mi, Quần jean"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: ao-thu-dong"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Danh mục cha</label>
                <Select
                  name="parentId"
                  value={String(formData.parentId)}
                  onValueChange={(value) => handleSelectChange("parentId", value)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Chọn danh mục cha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Không có</SelectItem>
                    {categories &&
                      categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div >
              <div className="mt-2 flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("category-image")?.click()}
                >
                  Chọn ảnh đại diện
                </Button>
                <input
                  id="category-image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e)}

                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="max-h-40 rounded border"
                    />
                    <span className="text-sm text-muted-foreground block mt-1">
                      {formData.image.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Mô tả danh mục</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[100px] w-full resize-none rounded-md border border-input bg-white px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Mô tả chi tiết về danh mục sản phẩm"
              />
            </div>


          </div>
        </div>

        <div className="text-right">

          <Button type="submit" className="mt-6 text-right">
            Thêm Danh Mục
          </Button>
        </div>
      </form>
    </div>
  )
}
