import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const categories = ["all", "training", "grooming", "health", "food", "adoption"]

export default function AdminBlogs() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [blogs, setBlogs] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState("latest")

  const fetchBlogs = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setBlogs(data)
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  // helpers
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })

  const getReadTime = (text) =>
    Math.ceil(text.split(" ").length / 200)

  // filters
  const filteredBlogs = blogs
    .filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(b =>
      category === "all" ? true : b.category === category
    )
    .sort((a, b) =>
      sort === "latest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    )

  // delete with double confirm
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return
    if (!window.confirm("This action cannot be undone. Continue?")) return

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.ok) {
      toast.success("Deleted")
      fetchBlogs()
    } else {
      toast.error("Failed")
    }
  }

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Manage Blogs 📝
        </h1>

        <button
          onClick={() => navigate("/admin/blogs/create")}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          + Add Blog
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6">

        {/* search */}
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />

        {/* category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          {categories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>

      </div>

      {/* LIST */}
<div className="space-y-4 max-h-125 overflow-y-auto pr-2 scroll-smooth">
        {filteredBlogs.map(blog => (

          <div
            key={blog._id}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex justify-between items-center"
          >

            {/* LEFT */}
            <div>
              <p className="font-semibold">{blog.title}</p>

              <div className="text-sm text-gray-500 flex gap-3 mt-1 flex-wrap">
                <span>{blog.category}</span>
                <span>•</span>
                <span>{getReadTime(blog.content)} min read</span>
                <span>•</span>
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>

            {/* RIGHT */}
          <div className="flex gap-4">

  <button
    onClick={() => navigate(`/blog/${blog.slug}`)}
    className="text-gray-600 hover:underline"
  >
    View
  </button>

  <button
    onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
    className="text-blue-500 hover:underline"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(blog._id)}
    className="text-red-500 hover:underline"
  >
    Delete
  </button>

</div>

          </div>

        ))}

        {filteredBlogs.length === 0 && (
          <p className="text-gray-500">No blogs found</p>
        )}

      </div>

    </div>
  )
}