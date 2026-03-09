export default function ContactPage() {
  return (
    <section className="min-h-screen bg-linear-to-br from-yellow-50 via-white to-orange-50 py-28 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-24">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
            Let’s Talk 🐾
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether it’s about walks, grooming or meals —  
            we’re here to help. Our team responds within 24 hours.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Left Info */}
          <div className="space-y-10">

            <div className="bg-white p-10 rounded-3xl shadow-md hover:shadow-xl transition">
              <h3 className="text-xl font-bold mb-3">📧 Email Support</h3>
              <p className="text-gray-600">support@pawpaw.in</p>
              <p className="text-sm text-gray-500 mt-2">
                For bookings, issues or general questions.
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-md hover:shadow-xl transition">
              <h3 className="text-xl font-bold mb-3">📞 Phone Support</h3>
              <p className="text-gray-600">+91 98765 43210</p>
              <p className="text-sm text-gray-500 mt-2">
                Available 9 AM – 8 PM, all days.
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-md hover:shadow-xl transition">
              <h3 className="text-xl font-bold mb-3">📍 Service Locations</h3>
              <p className="text-gray-600">
                Currently serving Sangli, Kolhapur  
                and expanding across nearby cities.
              </p>
            </div>

          </div>

          {/* Right Form */}
          <div className="bg-white p-12 rounded-3xl shadow-2xl">

            <h3 className="text-2xl font-bold mb-8 text-gray-900">
              Send us a message
            </h3>

            <form className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="How can we help you?"
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  )
}