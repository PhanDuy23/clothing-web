"use client"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { createBanner } from "../../services/banners"

export function NewBannerForm() {
  const [formData, setFormData] = useState<{
    title: string
    description: string
    slug: string
    image: File | null
  }>({
    title: "",
    description: "",
    slug: "",
    image: null,
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] })
    }
  }

  const handleAddSlide = async (e: FormEvent) => {
    e.preventDefault()
    console.log("Slide data submitted:", formData)

    const { success, message } = await createBanner(formData)
    if (success) {
      alert(message)
      setFormData({
        title: "",
        description: "",
        slug: "",
        image: null,
      })
    } else {
      alert(message)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Thêm Slide Mới</h1>
      <form onSubmit={handleAddSlide} className="p-6">
        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tiêu đề</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Giảm giá mùa hè"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="giam-gia-mua-he"
                />
              </div>
            </div>

            <div>
              <div className="mt-2 flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("slide-image")?.click()}
                >
                  Chọn ảnh slide
                </Button>
                <input
                  id="slide-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
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
              <label className="text-sm font-medium">Mô tả ngắn</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[100px] w-full resize-none rounded-md border border-input bg-white px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Mô tả ngắn gọn nội dung của slide"
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <Button type="submit" className="mt-6">
            Thêm Slide
          </Button>
        </div>
      </form>
    </div>
  )
}
