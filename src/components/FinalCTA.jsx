import { Link } from "react-router-dom"

export default function FinalCTA() {
  const user = JSON.parse(localStorage.getItem("user"))
  const redirectLink = user ? "/app/dashboard" : "/register"

  return (
    <section className="w-full bg-orange-500 py-24 text-white">
      <div className="max-w-5xl mx-auto px-8 text-center">
        
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Ready to make your dog’s life happier? 🐾
        </h2>

        <p className="mt-6 text-lg text-orange-100">
          Book a walk, schedule grooming, or explore fresh meals — all in one place.
        </p>

        <Link
          to={redirectLink}
          className="inline-block mt-10 bg-white text-orange-600 px-10 py-4 rounded-full font-semibold text-lg hover:bg-orange-100 transition"
        >
          Get Started Today
        </Link>

      </div>
    </section>
  )
}