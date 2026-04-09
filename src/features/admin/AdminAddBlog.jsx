import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function AdminAddBlog() {
    const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "training",
    image: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Blog added 🐾")
        setForm({ title: "", content: "", category: "training", image: "" })
      } else {
        toast.error(data.message)
      }

    } catch {
      toast.error("Something went wrong")
    }
  }
  const getReadTime = (text) => {
  if (!text) return 0
  return Math.ceil(text.split(" ").length / 200)
}

return (
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

    {/* LEFT: FORM */}
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Add New Blog ✍️
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <button
          type="button"
          onClick={() => navigate("/admin/blogs")}
          className="text-orange-500 mb-4 hover:underline"
        >
          ← Back to Blogs
        </button>

        <input
          name="title"
          placeholder="Blog Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        />

        <input
          name="image"
          placeholder="Image URL"
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
          placeholder="Write your blog..."
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
          Publish Blog 🚀
        </button>

      </form>

    </div>

    {/* RIGHT: LIVE PREVIEW */}
    <div className="sticky top-6 h-fit">

      <h2 className="text-xl font-semibold mb-4">
        Preview 👀
      </h2>

      <div className="bg-white rounded-3xl shadow overflow-hidden">

        {/* image */}
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
            {form.title || "Your blog title..."}
          </h1>

          <div className="text-sm text-gray-500 mt-2">
            ✍️ PawPaw Team • {getReadTime(form.content)} min read

          </div>
<div className="mt-4 text-gray-700 text-sm space-y-3 max-h-100 overflow-y-auto">
          <div className="mt-4 text-gray-700 text-sm space-y-3">

            {form.content
  ? form.content.split("\n").map((p, i) => (
      <p key={i}>{p}</p>
    ))
  : "Your content preview will appear here..."}

          </div>
          </div>

        </div>

      </div>

    </div>

  </div>
)
}