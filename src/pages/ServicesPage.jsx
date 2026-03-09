import { Link } from "react-router-dom"
import { Footprints, Scissors, Utensils } from "lucide-react"

export default function Services() {
  const user = JSON.parse(localStorage.getItem("user"))
  const bookLink = user ? "/app/book" : "/register"

  const services = [
    {
      icon: <Footprints size={42} />,
      title: "Daily Dog Walking",
      desc: "Trained walkers. Live updates. Stress-free steps."
    },
    {
      icon: <Utensils size={42} />,
      title: "Fresh Meals",
      desc: "Ready-to-eat meals crafted for energy & gut health."
    },
    {
      icon: <Scissors size={42} />,
      title: "At-Home Grooming",
      desc: "Calm, professional grooming at your doorstep."
    }
  ]

  return (
    <section className="relative py-24 px-6 bg-linear-to-br from-yellow-50 via-white to-orange-50 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Everything your dog needs,
            <span className="text-orange-500"> in one place.</span>
          </h1>
          <p className="text-lg text-gray-600">
            Walks. Meals. Grooming. Book in seconds.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {services.map((service, i) => (
            <div
              key={i}
              className="group bg-white/70 backdrop-blur-lg border border-white/40 p-10 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-orange-100 text-orange-500 mb-6 group-hover:scale-110 transition">
                {service.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                {service.title}
              </h3>

              <p className="text-gray-600 mb-8">
                {service.desc}
              </p>

              <Link
                to={bookLink}
                className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
              >
                Book Now →
              </Link>
            </div>
          ))}
        </div>

      </div>
{/* How It Works */}
<div className="mt-32">
  <h2 className="text-4xl font-extrabold text-center mb-16">
    How It Works
  </h2>

  <div className="grid md:grid-cols-3 gap-10 relative">
    {[
      {
        step: "01",
        title: "Book Instantly",
        desc: "Choose your service & schedule in seconds."
      },
      {
        step: "02",
        title: "Expert Arrives",
        desc: "Verified professional comes to your doorstep."
      },
      {
        step: "03",
        title: "Relax",
        desc: "Get updates while your dog gets the best care."
      }
    ].map((item, i) => (
      <div
        key={i}
        className="bg-white rounded-3xl p-10 shadow-md hover:shadow-xl transition group"
      >
        <div className="text-6xl font-black text-orange-100 group-hover:text-orange-200 transition mb-4">
          {item.step}
        </div>
        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
        <p className="text-gray-600">{item.desc}</p>
      </div>
    ))}
  </div>
</div>
{/* Trust Section */}
<div className="mt-32 bg-linear-to-r from-orange-500 to-yellow-400 rounded-3xl p-16 text-white">
  <h2 className="text-4xl font-extrabold text-center mb-14">
    Why PawPaw?
  </h2>

  <div className="grid md:grid-cols-3 gap-12 text-center">
    <div>
      <div className="text-5xl font-black mb-4">100%</div>
      <p className="font-semibold">Background Verified Experts</p>
    </div>

    <div>
      <div className="text-5xl font-black mb-4">₹0</div>
      <p className="font-semibold">Hidden Charges</p>
    </div>

    <div>
      <div className="text-5xl font-black mb-4">24/7</div>
      <p className="font-semibold">Customer Support</p>
    </div>
  </div>
</div>
{/* Pricing */}
<div className="mt-28 text-center">
  <h2 className="text-3xl font-bold mb-6">
    Clear Pricing. No Surprises.
  </h2>

  <p className="max-w-2xl mx-auto text-gray-600 mb-10">
    You see the price before you book. No hidden fees. No last-minute add-ons.
  </p>

  <Link
    to={bookLink}
    className="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 transition"
  >
    Get Started
  </Link>
</div>
    </section>
  )
}