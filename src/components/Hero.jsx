import { Link } from "react-router-dom"

export default function Hero() {
  const user = JSON.parse(localStorage.getItem("user"))
  const bookLink = user ? "/app/book" : "/register"

  return (
    <section className="w-full bg-linear-to-b from-yellow-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
        
        <div className="flex-1">
          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Happy dogs. <br />
            <span className="text-orange-500">Stress-free humans.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Walks, grooming, fresh meals and belly rubs — all in one playful little app made for modern pet parents.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to={bookLink}
              className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
            >
              Book a Walk 🐾
            </Link>

            <Link
              to="/services"
              className="bg-white border border-gray-300 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              See Services
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1"
            alt="Happy dog"
            className="rounded-3xl shadow-xl w-full max-w-md object-cover"
          />
        </div>

      </div>
    </section>
  )
}