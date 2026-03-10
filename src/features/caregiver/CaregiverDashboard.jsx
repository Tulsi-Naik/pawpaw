import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function CaregiverDashboard() {
  const token = localStorage.getItem("token")
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
const user = JSON.parse(localStorage.getItem("user"))
useEffect(() => {
  const fetchData = async () => {
    try {
      const [openRes, assignedRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/bookings/open`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/bookings/my-assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const openData = await openRes.json()
      const assignedData = await assignedRes.json()

      setBookings([...assignedData, ...openData])

    } catch {
      toast.error("Failed to load bookings")
    }

    setLoading(false)
  }

  fetchData()
}, [token])

  const handleAccept = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/accept`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (res.ok) {
        const updated = bookings.map(b =>
          b._id === id ? { ...b, status: "Accepted" } : b
        )
        setBookings(updated)
        toast.success("Booking accepted 🐾")
      } else {
        toast.error("Already taken")
      }
    } catch {
      toast.error("Error accepting booking")
    }
  }

  if (loading) return <div className="p-10">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto py-16 px-6 space-y-10">

     <h1 className="text-4xl font-extrabold text-center">
  {user?.skills?.includes("grooming")
    ? "Groomer Dashboard ✂️"
    : "Walker Dashboard 🐕"}
</h1>

      {/* ✅ Accepted Walks */}
<h2 className="text-2xl font-bold">
  {user?.skills?.includes("grooming")
    ? "My Accepted Grooming Jobs"
    : "My Accepted Walks"}
</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {bookings
          .filter(b => b.status === "Accepted")
          .map(booking => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-md p-6 space-y-4 border-l-4 border-green-500"
            >
            <p className="text-sm font-semibold text-blue-600">
  {booking.service?.category === "walking" ? "🐕 Dog Walk" : "✂️ Grooming"}
</p>

<h3 className="font-bold text-lg">
  {booking.pet?.name}
</h3>

              <p className="text-gray-600">
                {new Date(booking.date).toDateString()}
              </p>

              <p className="text-gray-600">
                {booking.timeSlot} • {booking.duration} mins
              </p>

              <p className="font-semibold text-orange-600">
                ₹{booking.finalPrice}
              </p>

              <p className="text-gray-600">
                📍 {booking.pet?.owner?.city}
              </p>

              <p className="text-gray-600 text-sm">
                📞 {booking.pet?.owner?.phone}
              </p>

              <span className="text-green-600 font-semibold">
                Accepted
              </span>
            </div>
          ))}
      </div>

      {/* ✅ Pending Requests */}
<h2 className="text-2xl font-bold mt-12">
  {user?.skills?.includes("grooming")
    ? "Open Grooming Requests"
    : "Open Walk Requests"}
</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {bookings
          .filter(b => b.status === "Pending")
          .map(booking => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-md p-6 space-y-4"
            >
             <p className="text-sm font-semibold text-blue-600">
  {booking.service?.category === "walking" ? "🐕 Dog Walk" : "✂️ Grooming"}
</p>

<h3 className="font-bold text-lg">
  {booking.pet?.name}
</h3>

              <p className="text-gray-600">
                {new Date(booking.date).toDateString()}
              </p>

              <p className="text-gray-600">
                {booking.timeSlot} • {booking.duration} mins
              </p>

              <p className="font-semibold text-orange-600">
                ₹{booking.finalPrice}
              </p>

              <p className="text-gray-600">
                📍 {booking.pet?.owner?.city}
              </p>

              <p className="text-gray-600 text-sm">
                📞 {booking.pet?.owner?.phone}
              </p>

              <button
                onClick={() => handleAccept(booking._id)}
                className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition"
              >
                Accept Booking
              </button>
            </div>
          ))}
      </div>

    </div>
  )
}