import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function AdminEditBlog() {

  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "training",
    image: ""
  })

  const getReadTime = (text) => {
    if (!text) return 0
    return Math.ceil(text.split(" ").length / 200)
  }

  // fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`)
      const data = await res.json()

      const blog = data.find(b => b._id === id)

      if (blog) {
        setForm({
          title: blog.title,
          content: blog.content,
          category: blog.category,
          image: blog.image
        })
      }
    }

    fetchBlog()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      toast.success("Updated ✨")
      navigate("/admin/blogs")
    } else {
      toast.error("Failed")
    }
  }

  return (
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

      {/* FORM */}
      <div>

        <button
          type="button"
          onClick={() => navigate("/admin/blogs")}
          className="text-orange-500 mb-4 hover:underline"
        >
          ← Back to Blogs
        </button>

        <h1 className="text-3xl font-bold mb-6">
          Edit Blog ✍️
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          >
            <option value="training">Training</option>
            <option value="grooming">Grooming</option>
            <option value="health">Health</option>
            <option value="food">Food</option>
            <option value="adoption">Adoption</option>
          </select>

          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={12}
            className="w-full p-3 border rounded-xl"
            required
          />

          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-3 rounded-xl"
          >
            Update Blog 🚀
          </button>

        </form>

      </div>

      {/* PREVIEW */}
      <div className="sticky top-6 h-fit">

        <h2 className="text-xl font-semibold mb-4">
          Preview 👀
        </h2>

        <div className="bg-white rounded-3xl shadow overflow-hidden">

          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="w-full h-48 object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}

          <div className="p-6">

            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
              {form.category}
            </span>

            <h1 className="text-xl font-bold mt-3">
              {form.title || "Title..."}
            </h1>

            {form.content && (
              <div className="text-sm text-gray-500 mt-2">
                ✍️ PawPaw Team • {getReadTime(form.content)} min read
              </div>
            )}

            <div className="mt-4 text-gray-700 text-sm space-y-3 max-h-[400px] overflow-y-auto">

              {form.content
                ? form.content.split("\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))
                : "Preview appears here..."}

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}