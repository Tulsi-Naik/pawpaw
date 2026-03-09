export default function Services() {
  const services = [
    {
      title: "Dog Walking",
      desc: "Safe, fun walks with trained walkers near you.",
      emoji: "🐕",
    },
    {
      title: "Grooming",
      desc: "Spa days, nail trims, and full makeovers.",
      emoji: "✂️",
    },
    {
      title: "Fresh Meals",
      desc: "Nutritious, vet-approved meals delivered home.",
      emoji: "🥣",
    },
  ]

  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-6xl mx-auto px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Everything your dog needs 🐾
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            All services in one playful, easy-to-use platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-yellow-50 rounded-3xl p-10 text-center shadow-sm hover:shadow-lg transition"
            >
              <div className="text-5xl mb-6">{service.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-900">
                {service.title}
              </h3>
              <p className="mt-4 text-gray-600">
                {service.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}