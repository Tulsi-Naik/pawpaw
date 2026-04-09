import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const categories = ["all", "training", "grooming", "health", "food", "adoption"]

export default function BlogListPage() {

  const [blogs, setBlogs] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const navigate = useNavigate()
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    const fetchBlogs = async () => {

      const url =
        activeCategory === "all"
          ? `${import.meta.env.VITE_API_URL}/api/blogs`
          : `${import.meta.env.VITE_API_URL}/api/blogs?category=${activeCategory}`

      const res = await fetch(url)
      const data = await res.json()
      setBlogs(data)
    }

    fetchBlogs()
  }, [activeCategory])
useEffect(() => {
  setVisibleCount(6)
}, [activeCategory])
  return (
    <div className="max-w-6xl mx-auto py-16 px-6">

      <h1 className="text-4xl font-extrabold mb-8 text-center">
        Pawsome Tips for Happy Dogs 🐶
      </h1>

      {/* CATEGORY TABS */}
      <div className="flex gap-3 overflow-x-auto mb-10 pb-2">

        {categories.map(cat => (

          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full whitespace-nowrap transition
              ${activeCategory === cat
                ? "bg-orange-500 text-white"
                : "bg-gray-100 hover:bg-orange-100"}
            `}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>

        ))}

      </div>

      {/* BLOG GRID */}
      <div className="grid md:grid-cols-3 gap-8">

        {blogs.slice(0, visibleCount).map(blog => (


          <div
            key={blog._id}
            onClick={() => navigate(`/blog/${blog.slug}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
          >

            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-5 space-y-2">

              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                {blog.category}
              </span>

              <h2 className="font-bold text-lg">
                {blog.title}
              </h2>

              <p className="text-sm text-gray-500">
                {blog.content.slice(0, 80)}...
              </p>

            </div>

          </div>

        ))}

      </div>
      {visibleCount < blogs.length && (
  <div className="text-center mt-10">
    <button
      onClick={() => setVisibleCount(prev => prev + 6)}
      className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600"
    >
      Load More 🐾
    </button>
  </div>
)}

    </div>
  )
}