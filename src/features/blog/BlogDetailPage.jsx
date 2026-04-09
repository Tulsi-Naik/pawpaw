import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function BlogDetailPage() {

  const { slug } = useParams()
  const navigate = useNavigate()

  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])

  // 📌 calculate read time
  const getReadTime = (text) => {
    const words = text.split(" ").length
    return Math.ceil(words / 200) // avg reading speed
  }

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${slug}`)
      const data = await res.json()
      setBlog(data)

      // fetch related (same category)
      const relRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blogs?category=${data.category}`
      )
      const relData = await relRes.json()

      setRelatedBlogs(relData.filter(b => b.slug !== data.slug).slice(0, 3))
    }

    fetchBlog()
  }, [slug])

  if (!blog) {
    return <div className="text-center py-20">Loading...</div>
  }
  const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}

  return (
    <div className="bg-gray-50">

      {/* HERO */}
      <div className="relative h-80 md:h-105 w-full overflow-hidden">

        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-4xl mx-auto px-6 pb-10 text-white">

            <span className="bg-orange-500 px-3 py-1 rounded-full text-sm">
              {blog.category}
            </span>

            <h1 className="text-3xl md:text-5xl font-extrabold mt-4 leading-tight">
              {blog.title}
            </h1>

            {/* META */}
            <div className="mt-4 text-sm text-gray-200">
   <span>✍️ PawPaw Team</span> •{" "}
<span>{getReadTime(blog.content)} min read</span> •{" "}
<span>{formatDate(blog.createdAt)}</span>
            </div>

          </div>
        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-6 py-16">

        <button
          onClick={() => navigate("/blog")}
          className="text-orange-500 mb-10 hover:underline"
        >
          ← Back to Blogs
        </button>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm">

          <div className="prose prose-lg max-w-none 
            prose-p:text-gray-700 
            prose-headings:text-gray-900 
            leading-relaxed"
          >

            {blog.content.split("\n").map((para, i) => {

              if (para.startsWith("🐾")) {
                return (
                  <h2 key={i} className="mt-8 font-bold text-xl">
                    {para}
                  </h2>
                )
              }

              return <p key={i}>{para}</p>
            })}

          </div>

        </div>

      </div>

      {/* RELATED BLOGS */}
      {relatedBlogs.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 pb-20">

          <h2 className="text-2xl font-bold mb-6">
            You might also like 🐾
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {relatedBlogs.map(item => (
              <div
                key={item._id}
                onClick={() => navigate(`/blog/${item.slug}`)}
                className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">

                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    {item.category}
                  </span>

                  <h3 className="font-semibold mt-2">
                    {item.title}
                  </h3>

                </div>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  )
}