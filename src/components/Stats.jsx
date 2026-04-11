export default function Stats() {
 const stats = [
  { number: "3", label: "Services" },
  { number: "Local", label: "Pet Caregivers" },
  { number: "Now", label: "In Your City" },
  { number: "Quick", label: "Booking" },
]

  return (
    <section className="w-full bg-orange-50 py-24">
      <div className="max-w-6xl mx-auto px-8 text-center">

        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-16">
          Built for modern pet parents
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((item, index) => (
            <div key={index} className="group">

              {/* Number */}
              <div className="text-4xl font-extrabold text-orange-500 group-hover:scale-105 transition">
                {item.number}
              </div>

              {/* Label */}
              <div className="mt-3 text-gray-700 font-medium">
                {item.label}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}