export default function AboutPage() {
  return (
    <section className="bg-linear-to-br from-yellow-50 via-white to-orange-50 py-28 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-24">
          <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
            We make dog parenting
            <span className="text-orange-500"> easier.</span>
          </h1>

          <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            PawPaw exists to remove the daily stress of caring for your dog.
            From walks to grooming, we bring trusted care right to your doorstep.
          </p>
        </div>

        {/* Mission Block */}
        <div className="bg-white rounded-3xl shadow-xl p-16 mb-28">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Our Mission
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto">
            To build India’s most trusted dog care platform —
            where reliability, transparency, and love for dogs
            come together in one simple app.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-white/70 backdrop-blur-lg p-10 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition">
            <div className="text-5xl mb-6">🐶</div>
            <h3 className="text-2xl font-bold mb-4">Happy Dogs First</h3>
            <p className="text-gray-600">
              Every service is designed around comfort, safety, and joy.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg p-10 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition">
            <div className="text-5xl mb-6">🛡️</div>
            <h3 className="text-2xl font-bold mb-4">Verified Experts</h3>
            <p className="text-gray-600">
              Background-checked professionals you can trust.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg p-10 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition">
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold mb-4">Simple & Transparent</h3>
            <p className="text-gray-600">
              Clear pricing. Instant booking. No surprises.
            </p>
          </div>

        </div>

        {/* Big Closing Statement */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            Built for modern dog parents.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Because your dog isn’t just a pet —
            they’re family.
          </p>
        </div>

      </div>
    </section>
  )
}