import { useState } from "react"
import toast from "react-hot-toast"
import { Mail, MapPin, Phone } from "lucide-react"

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
}

export default function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please add your name, email, and message")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Could not send message")
        return
      }

      setForm(initialForm)
      toast.success("Message sent. PawPaw will get back to you soon.")
    } catch {
      toast.error("Could not send message right now")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen bg-linear-to-br from-yellow-50 via-white to-orange-50 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-5">
            Contact PawPaw
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Questions about walks, grooming, adoption, payments, or bookings can be sent here.
          </p>
        </div>

        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex gap-4">
              <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Email</h3>
                <a href="mailto:tulsivnaik@gmail.com" className="text-gray-700 hover:text-orange-600">
                  admin@pawpaw.com
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex gap-4">
              <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Phone</h3>
                <a href="tel:+919066251008" className="text-gray-700 hover:text-orange-600">
                  +91 90662 51008
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex gap-4">
              <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Service Area</h3>
                <p className="text-gray-700">Vijaynagar, Sangli</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 md:p-10 rounded-2xl shadow-xl border border-orange-100">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              Send a Query
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Your name"
                    className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                    className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="Optional"
                    className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                    placeholder="Booking, adoption, payment..."
                    className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="5"
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Tell us how we can help."
                  className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60 transition"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
