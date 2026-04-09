import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function BlogPreview() {

  const [blogs, setBlogs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`)
      const data = await res.json()

      setBlogs(data.slice(0, 3)) // only 3
    }

    fetchBlogs()
  }, [])

  return (
    <section className="w-full bg-white py-20">

      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold">
            Pet Care Tips 🐶
          </h2>
          <p className="text-gray-600 mt-2">
            Learn how to keep your furry friend happy and healthy
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          {blogs.map(blog => (

            <div
              key={blog._id}
              onClick={() => navigate(`/blog/${blog.slug}`)}
              className="cursor-pointer group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >

              <div className="overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-5 space-y-2">

                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                  {blog.category}
                </span>

                <h3 className="font-bold text-lg group-hover:text-orange-500 transition">
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {blog.content.slice(0, 70)}...
                </p>

              </div>

            </div>

          ))}

        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/blog")}
            className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
          >
            Read More Tips →
          </button>
        </div>

      </div>

    </section>
  )
}