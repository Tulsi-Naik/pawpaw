import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function MyBookingsPage() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const activeBookings = bookings.filter(
    b => b.status !== "Completed"
  )

  const historyBookings = bookings.filter(
    b => b.status === "Completed"
  )

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("${process.env.REACT_APP_API_URL}/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` }
        })

        const data = await res.json()
        setBookings(data)
      } catch {
        toast.error("Failed to load bookings")
      }

      setLoading(false)
    }

    fetchBookings()
  }, [token])

  const handleCancel = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/bookings/${id}/cancel`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (res.ok) {
        setBookings(bookings.map(b =>
          b._id === id ? { ...b, status: "Cancelled" } : b
        ))
        toast.success("Booking cancelled")
      }
    } catch {
      toast.error("Cancel failed")
    }
  }

  if (loading) return <div className="p-10">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto py-16 px-6 space-y-10">

      <h1 className="text-4xl font-extrabold text-center">
        My Bookings 🐾
      </h1>

      {bookings.length === 0 && (
        <p className="text-center text-gray-500">
          No bookings yet.
        </p>
      )}

      {/* ACTIVE BOOKINGS */}

      <div className="grid md:grid-cols-2 gap-6">
        {activeBookings.map(booking => (
          <div
            key={booking._id}
            className="bg-white rounded-2xl shadow-md p-6 space-y-4"
          >

            <div className="flex justify-between items-center">

              <div>
                <h3 className="font-bold text-lg">
                  {booking.pet?.name}
                </h3>

                <p className="text-sm text-gray-500 capitalize">
                  {booking.service?.category} service
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold
                ${
                  booking.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : booking.status === "Accepted"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "InProgress"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {booking.status}
              </span>

            </div>

            <p className="text-gray-600">
              {new Date(booking.date).toDateString()}
            </p>

            <p className="text-gray-600">
              {booking.timeSlot} • {booking.duration} mins
            </p>

            <p className="font-semibold text-orange-600">
              ₹{booking.finalPrice}
            </p>

            {booking.caregiver && (
              <div className="flex items-center gap-3 mt-3 border-t pt-3">

                {booking.caregiver.profilePhoto ? (
                  <img
                    src={booking.caregiver.profilePhoto}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                    {booking.caregiver.name.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold">
                    {booking.caregiver.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {booking.caregiver.phone}
                  </p>
                </div>

              </div>
            )}
            {booking.status === "InProgress" && (
  <button
    onClick={() => navigate(`/app/track/${booking._id}`)}
    className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
  >
    Track Walk
  </button>
)}

            {booking.status === "Pending" && (
              <button
                onClick={() => handleCancel(booking._id)}
                className="text-red-500 font-medium"
              >
                Cancel Booking
              </button>
            )}

          </div>
        ))}
      </div>

      {/* HISTORY SECTION */}

      {historyBookings.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-center mt-16">
            Booking History
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {historyBookings.map(booking => (
              <div
                key={booking._id}
                className="bg-gray-50 border rounded-2xl p-6 space-y-4"
              >

                <div className="flex justify-between items-center">

                  <div>
                    <h3 className="font-bold text-lg">
                      {booking.pet?.name}
                    </h3>

                    <p className="text-sm text-gray-500 capitalize">
                      {booking.service?.category} service
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                    Completed
                  </span>

                </div>

                <p className="text-gray-600">
                  {new Date(booking.date).toDateString()}
                </p>

                <p className="text-gray-600">
                  {booking.timeSlot} • {booking.duration} mins
                </p>

                <p className="font-semibold text-gray-700">
                  ₹{booking.finalPrice}
                </p>

              </div>
            ))}

          </div>
        </>
      )}

    </div>
  )
}