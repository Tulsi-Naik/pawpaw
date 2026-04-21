import { Link } from "react-router-dom"
import { PawPrint, Scissors, Heart } from "lucide-react"

export default function Services() {
  const user = JSON.parse(localStorage.getItem("user"))
  const bookLink = user ? "/app/book" : "/register"

  const services = [
    {
      icon: <PawPrint size={42} />,
      title: "Dog Walking",
      desc: "Daily walks handled by trusted caregivers."
    },
    {
      icon: <Heart size={42} />,
      title: "Adoption",
      desc: "Connect with dogs looking for a new home."
    },
    {
      icon: <Scissors size={42} />,
      title: "Grooming",
      desc: "Professional grooming at your doorstep."
    }
  ]

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-yellow-50 via-white to-orange-50">

      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-24">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Simple care for your dog.
          </h1>
          <p className="text-lg text-gray-600">
            Book services, track activity, and manage everything in one place.
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

        {/* WALKING */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <img
            src="https://images.unsplash.com/photo-1729175235373-cc6cc675561e"
            className="rounded-3xl shadow-lg"
          />

          <div>
            <h2 className="text-4xl font-extrabold mb-4">
              Dog Walking
            </h2>

            <p className="text-gray-600 mb-10">
              Book a walk in seconds and track it live.
            </p>

            <div className="relative border-l-2 border-orange-200 pl-6 space-y-8">
              <div>
                <div className="absolute -left-3 w-6 h-6 bg-orange-500 rounded-full"></div>
                <h4 className="font-semibold">Book</h4>
                <p className="text-gray-600 text-sm">Select dog and time slot</p>
              </div>

              <div>
                <div className="absolute -left-3 w-6 h-6 bg-orange-500 rounded-full"></div>
                <h4 className="font-semibold">Confirm</h4>
                <p className="text-gray-600 text-sm">Caregiver accepts request</p>
              </div>

              <div>
                <div className="absolute -left-3 w-6 h-6 bg-orange-500 rounded-full"></div>
                <h4 className="font-semibold">Track</h4>
                <p className="text-gray-600 text-sm">Follow the walk live</p>
              </div>
            </div>

            <Link
              to={bookLink}
              className="inline-block mt-10 bg-orange-500 text-white px-6 py-3 rounded-full font-semibold"
            >
              Book Walk →
            </Link>
          </div>
        </div>

        {/* ADOPTION */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <h2 className="text-4xl font-extrabold mb-4">
              Adoption
            </h2>

            <p className="text-gray-600 mb-10">
              Connect directly with owners and adopt responsibly.
            </p>

            <div className="relative border-l-2 border-orange-200 pl-6 space-y-8">
              <div>
                <div className="absolute -left-3 w-6 h-6 bg-orange-500 rounded-full"></div>
                <h4 className="font-semibold">Browse</h4>
                <p className="text-gray-600 text-sm">View available dogs</p>
              </div>

              <div>
                <div className="absolute -left-3 w-6 h-6 bg-orange-500 rounded-full"></div>
                <h4 className="font-semibold">Request</h4>
                <p className="text-gray-600 text-sm">Send request</p>
              </div>

              <div>
                <div className="absolute -left-3 w-6 h-6 bg-orange-500 rounded-full"></div>
                <h4 className="font-semibold">Connect</h4>
                <p className="text-gray-600 text-sm">Finalize with owner</p>
              </div>
            </div>

            <Link
              to="/services/adoption"
              className="inline-block mt-10 bg-orange-500 text-white px-6 py-3 rounded-full font-semibold"
            >
              Explore →
            </Link>
          </div>

          <img
            src="https://plus.unsplash.com/premium_photo-1661503267592-56e6bfbdc6e4"
            className="rounded-3xl shadow-lg"
          />
        </div>

        {/* GROOMING */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <img
            src="https://images.unsplash.com/photo-1611173622933-91942d394b04"
            className="rounded-3xl shadow-lg"
          />

          <div>
            <h2 className="text-4xl font-extrabold mb-4">
              Grooming
            </h2>

            <p className="text-gray-600 mb-10">
              Book professional grooming at home.
            </p>

            <div className="relative border-l-2 border-orange-200 pl-6 space-y-8">
              <div>
                <div className="absolute -left-3 w-6 h-6 bg-orange-500 rounded-full"></div>
                <h4 className="font-semibold">Schedule</h4>
                <p className="text-gray-600 text-sm">Choose time</p>
              </div>

              <div>
                <div className="absolute -left-3 w-6 h-6 bg-orange-500 rounded-full"></div>
                <h4 className="font-semibold">Confirm</h4>
                <p className="text-gray-600 text-sm">Caregiver assigned</p>
              </div>

              <div>
                <div className="absolute -left-3 w-6 h-6 bg-orange-500 rounded-full"></div>
                <h4 className="font-semibold">Done</h4>
                <p className="text-gray-600 text-sm">Grooming completed</p>
              </div>
            </div>

            <Link
              to={bookLink}
              className="inline-block mt-10 bg-orange-500 text-white px-6 py-3 rounded-full font-semibold"
            >
              Book Grooming →
            </Link>
          </div>
        </div>

      </div>

      {/* WHY */}
      <div className="max-w-6xl mx-auto mt-24 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-3xl px-8 py-16 text-white text-center">
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
            <p>No hidden charges</p>
          </div>

          <div>
            <div className="text-5xl font-black mb-3">24/7</div>
            <p>Support available</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-24">
        <h2 className="text-3xl font-bold mb-6">
          Ready to get started?
        </h2>

        <Link
          to={bookLink}
          className="inline-block bg-orange-500 text-white px-10 py-4 rounded-full font-semibold hover:bg-orange-600 transition"
        >
          Get Started →
        </Link>
      </div>

    </section>
  )
}