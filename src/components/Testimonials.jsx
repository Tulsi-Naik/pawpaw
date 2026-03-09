export default function Testimonials() {
  const testimonials = [
    {
      name: "Ananya Mehta",
      text: "PawPaw made my life so much easier. My dog waits at the door now!",
    },
    {
      name: "Rohan Kulkarni",
      text: "Super clean grooming and very friendly staff.",
    },
    {
      name: "Sneha Iyer",
      text: "Fresh meals + regular walks = happiest dog ever.",
    },
    {
      name: "Arjun Shah",
      text: "Best decision I made for my pet this year.",
    },
  ]

  const loopItems = [...testimonials, ...testimonials]

  return (
    <section className="w-full bg-white py-24 overflow-hidden">
<div className="w-full px-8">        <h2 className="text-4xl font-extrabold text-center mb-16">
          What pet parents say 🐾
        </h2>

        <div className="overflow-hidden relative">
          <div className="flex gap-8 w-max animate-marquee">
            {loopItems.map((item, index) => (
              <div
                key={index}
                className="w-95 bg-yellow-50 p-10 rounded-3xl shadow-md shrink-0"
              >
                <div className="text-yellow-500 mb-4 text-lg">★★★★★</div>
                <p className="text-gray-700 leading-relaxed">
                  “{item.text}”
                </p>
                <div className="mt-6 font-semibold text-gray-900">
                  — {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </section>
  )
}