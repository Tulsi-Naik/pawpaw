import { Link } from "react-router-dom"

export default function Services() {

  const services = [
    {
      title: "Dog Walking",
      desc: "Daily exercise with trusted walkers near you.",
      flow: "Choose dog → Select timeslot → Book Walk",
      tag: "Popular",
      link: "/services/walking",
      image: "https://media.istockphoto.com/id/1990414767/photo/owner-and-her-beagle-dog-is-having-fun-while-walking-in-dog-park-in-morning-summer-dog.webp?a=1&b=1&s=612x612&w=0&k=20&c=gNbsow_u60MDhZOPi8fF5YzSuENBu5UxGJaC6Fe2Oeg=" // 🔁 change
    },
    {
      title: "Grooming",
      desc: "Professional care for a clean and happy dog.",
      flow: "Choose service → Set time → Relax",
      link: "/services/grooming",
      image: "https://media.istockphoto.com/id/1298295760/photo/funny-dog-sitting-at-the-grooming-salon.jpg?b=1&s=170667a&w=0&k=20&c=wfzr5xJp4ZpgrJhNyz4w0Gl35LeLsW1NmLGwtJI-pbs=" // 🔁 change
    },
    {
      title: "Adoption",
      desc: "Find and connect with your future companion.",
      flow: "Browse dogs → Send request → Connect",
      tag: "New",
      link: "/services/adoption",
      image: "https://thedigestonline.com/wp-content/uploads/2024/09/img-pet-adoption-101-e1695040329681.jpg" // 🔁 change
    }
  ]

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            What you can do with PawPaw
          </h2>
          <p className="text-lg text-gray-600">
            Simple, guided experiences designed for pet parents.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <Link
              to="/services"
              key={i}
              className="group relative h-[420px] rounded-3xl overflow-hidden"
            >
              {/* Image */}
<img
  src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Tag */}
              {service.tag && (
                <span className="absolute top-4 right-4 bg-white/90 text-black text-xs px-3 py-1 rounded-full">
                  {service.tag}
                </span>
              )}

              {/* Content */}
              <div className="absolute bottom-0 p-6 text-white">
                <h3 className="text-2xl font-semibold mb-2">
                  {service.title}
                </h3>

                <p className="text-sm text-gray-200 mb-2">
                  {service.desc}
                </p>

                <p className="text-xs text-gray-300 mb-4">
                  {service.flow}
                </p>

                <span className="text-sm font-medium underline opacity-80 group-hover:opacity-100">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}