export default function Stats() {
  const stats = [
    { number: "10,000+", label: "Happy Dogs" },
    { number: "2,500+", label: "Trusted Walkers" },
    { number: "50+", label: "Cities Covered" },
    { number: "4.9★", label: "Average Rating" },
  ]

  return (
    <section className="w-full bg-orange-50 py-24">
      <div className="max-w-6xl mx-auto px-8 text-center">
        
        <h2 className="text-4xl font-extrabold text-gray-900 mb-16">
          Loved by pet parents everywhere ❤️
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((item, index) => (
            <div key={index}>
              <div className="text-4xl font-extrabold text-orange-500">
                {item.number}
              </div>
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