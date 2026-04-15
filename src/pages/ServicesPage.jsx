import { Link } from "react-router-dom"
import { Footprints, Scissors, Heart } from "lucide-react"

export default function Services() {
  const user = JSON.parse(localStorage.getItem("user"))
  const bookLink = user ? "/app/book" : "/register"

  const services = [
    {
      icon: <Footprints size={42} />,
      title: "Dog Walking",
      desc: "Zoomies out. Calm dog back."
    },
    {
      icon: <Heart size={42} />,
      title: "Adoption",
      desc: "Find your forever chaos partner."
    },
    {
      icon: <Scissors size={42} />,
      title: "Grooming",
      desc: "From muddy to majestic."
    }
  ]

  return (
    <section className="py-24 px-6 bg-linear-to-br from-yellow-50 via-white to-orange-50">

      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Life gets busy.
            <span className="text-orange-500"> Your dog shouldn't suffer.</span>
          </h1>
          <p className="text-lg text-gray-600">
            Walks, grooming & adoption — all handled in a few clicks.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-10 mb-32">
          {services.map((service, i) => (
            <div
              key={i}
              className="group bg-white/70 backdrop-blur-lg p-10 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-orange-100 text-orange-500 mb-6 group-hover:scale-110 transition">
                {service.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {service.title}
              </h3>

              <p className="text-gray-600 mb-8">
                {service.desc}
              </p>

              <Link
                to={bookLink}
                className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
              >
                Explore →
              </Link>
            </div>
          ))}
        </div>

        {/* ---------------- WALKING ---------------- */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">

          <img
            src="https://images.unsplash.com/photo-1729175235373-cc6cc675561e?mark=https:%2F%2Fimages.unsplash.com%2Fopengraph%2Flogo.png&mark-w=64&mark-align=top%2Cleft&mark-pad=50&h=630&w=1200&crop=faces%2Cedges&blend-w=1&blend=000000&blend-mode=normal&blend-alpha=10&auto=format&fit=crop&q=60&ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzQ3MzMyMDYyfA&ixlib=rb-4.1.0"
            className="rounded-3xl shadow-lg"
          />

          <div>
            <h2 className="text-4xl font-extrabold mb-4">
              Walks your dog deserves 🐕
            </h2>

            <p className="text-gray-600 mb-6">
              You book. We walk. Your dog comes back happy (and tired 😌).
            </p>

            <ul className="space-y-3 text-gray-700 mb-6">
              <li>👉 Select your dog</li>
              <li>👉 Choose time slot</li>
              <li>👉 Book instantly</li>
              <li>👉 Caregiver accepts</li>
              <li>👉 Track live walk 📍</li>
              <li>👉 Cancel anytime if plans change</li>
            </ul>

            <Link
              to={bookLink}
              className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold"
            >
              Book a Walk →
            </Link>
          </div>
        </div>

        {/* ---------------- ADOPTION ---------------- */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">

          <div>
            <h2 className="text-4xl font-extrabold mb-4">
              Meet your new best friend ❤️
            </h2>

            <p className="text-gray-600 mb-6">
              No dog? Perfect. Start your journey here 🐶
            </p>

            <ul className="space-y-3 text-gray-700 mb-6">
              <li>👉 Browse available dogs</li>
              <li>👉 Send adoption request</li>
              <li>👉 Owner reviews & connects</li>
              <li>👉 Safe and simple process</li>
              <li>👉 First-time owners welcome 🎉</li>
            </ul>

            <Link
              to="/services/adoption"
              className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold"
            >
              Explore Adoption →
            </Link>
          </div>

          <img
            src="https://plus.unsplash.com/premium_photo-1661503267592-56e6bfbdc6e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZG9nJTIwYWRvcHRpb258ZW58MHx8MHx8&w=1000&q=80"
            className="rounded-3xl shadow-lg"
          />
        </div>

        {/* ---------------- GROOMING ---------------- */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">

          <img
            src="https://images.unsplash.com/photo-1611173622933-91942d394b04?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nJTIwZ3Jvb21pbmd8ZW58MHx8MHx8fDA%3DS"
            className="rounded-3xl shadow-lg"
          />

          <div>
            <h2 className="text-4xl font-extrabold mb-4">
              Spa day, but at home ✂️
            </h2>

            <p className="text-gray-600 mb-6">
              No stress. No travel. Just a fresh, fluffy dog.
            </p>

            <ul className="space-y-3 text-gray-700 mb-6">
              <li>👉 Select your dog</li>
              <li>👉 Choose time slot</li>
              <li>👉 Book grooming</li>
              <li>👉 Caregiver accepts</li>
              <li>👉 Sit back & relax 😎</li>
            </ul>

            <Link
              to={bookLink}
              className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold"
            >
              Book Grooming →
            </Link>
          </div>
        </div>

      </div>

      {/* TRUST */}
      <div className="max-w-6xl mx-auto mt-20 bg-linear-to-r from-orange-500 to-yellow-400 rounded-3xl p-16 text-white text-center">
        <h2 className="text-4xl font-extrabold mb-12">
          Why PawPaw?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="text-5xl font-black mb-3">100%</div>
            <p>Verified caregivers</p>
          </div>

          <div>
            <div className="text-5xl font-black mb-3">₹0</div>
            <p>Hidden charges</p>
          </div>

          <div>
            <div className="text-5xl font-black mb-3">24/7</div>
            <p>Support (we got you)</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-20">
        <h2 className="text-3xl font-bold mb-4">
          Ready to make your dog happier?
        </h2>

        <Link
          to={bookLink}
          className="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 transition"
        >
          Get Started →
        </Link>
      </div>

    </section>
  )
}