import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function MyBookingsPage() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState(null)
  const [search, setSearch] = useState("")
const [fromDate, setFromDate] = useState("")
const [toDate, setToDate] = useState("")
  const [tab, setTab] = useState("active")
const activeBookings = bookings
  .filter(b => b.status !== "Completed")
  .sort((a, b) => new Date(a.date) - new Date(b.date)) // nearest first

const historyBookings = bookings
  .filter(b => b.status === "Completed")
  .sort((a, b) => new Date(b.date) - new Date(a.date)) // latest first

const filteredHistory = historyBookings.filter(b => {
  const matchSearch =
    b.pet?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.service?.category?.toLowerCase().includes(search.toLowerCase())

  const bookingDate = new Date(b.date)

  const matchFrom = fromDate ? bookingDate >= new Date(fromDate) : true
  const matchTo = toDate ? bookingDate <= new Date(toDate) : true


  return matchSearch && matchFrom && matchTo
})

const groupedHistory = filteredHistory.reduce((acc, booking) => {
  const month = new Date(booking.date).toLocaleString("en-IN", {
    month: "long",
    year: "numeric"
  })

  if (!acc[month]) acc[month] = []
  acc[month].push(booking)

  return acc
}, {})

const isCompactView = filteredHistory.length > 6

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/my`, {
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
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/cancel`,
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
  const handlePayment = async (booking) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/payment/create-order/${booking._id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    const order = await res.json()

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "PawPaw",
      description: "Booking Payment",
      order_id: order.id,

      handler: async function (response) {
await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`   //  important
  },
  body: JSON.stringify(response)
})

        toast.success("Payment successful ")
        window.location.reload()
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()

  } catch (err) {
    toast.error("Payment failed")
  }
}

  if (loading) return <div className="p-10">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto py-16 px-6 space-y-10">

      <h1 className="text-4xl font-extrabold text-center">
        My Bookings 🐾
      </h1>
      <div className="flex justify-center gap-4 mt-6">
  <button
    onClick={() => setTab("active")}
    className={`px-6 py-2 rounded-full font-medium ${
      tab === "active"
        ? "bg-orange-500 text-white"
        : "bg-gray-200 text-gray-700"
    }`}
  >
    Active
  </button>

  <button
    onClick={() => setTab("history")}
    className={`px-6 py-2 rounded-full font-medium ${
      tab === "history"
        ? "bg-orange-500 text-white"
        : "bg-gray-200 text-gray-700"
    }`}
  >
    History
  </button>
</div>

      {bookings.length === 0 && (
        <p className="text-center text-gray-500">
          No bookings yet.
        </p>
      )}

      {/* ACTIVE BOOKINGS */}

{tab === "active" && (
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
              
<div>
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

  {booking.status === "Accepted" && booking.paymentStatus !== "Paid" && (
    <p className="text-sm text-orange-500 mt-1">
      Waiting for payment to confirm 🐾
    </p>
  )}
  {booking.paymentStatus === "Paid" && booking.status === "Accepted" && (
  <p className="text-sm text-green-600 mt-1">
    Booking confirmed 🎉
  </p>
)}
</div>

            </div>

          <p className="text-gray-600">
  📅 {new Date(booking.date).toDateString()}
</p>

<p className="text-xs text-gray-400">
  Booked on: {new Date(booking.createdAt).toDateString()}
</p>

            <p className="text-gray-600">
              {booking.timeSlot} • {booking.duration} mins
            </p>

           <div>
  <p className="font-semibold text-orange-600">
    ₹{booking.finalPrice}
  </p>

  {booking.paymentStatus === "Paid" && (
    <p className="text-green-600 text-sm font-semibold">
      Payment Completed ✅
    </p>
  )}
</div>
{booking.status === "Accepted" && booking.paymentStatus !== "Paid" && (
  <div className="mt-3 space-y-2">
    
   <p className="text-sm text-gray-500">
  Almost there! Complete payment to confirm your walk 🐾
</p>

    <button
  onClick={() => {
    setPayingId(booking._id)
    handlePayment(booking)
  }}
  disabled={payingId === booking._id}
      className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
    >
{payingId === booking._id ? "Processing..." : `Pay ₹${booking.finalPrice}`}
    </button>

  </div>
)}

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

{booking.status === "Pending" && booking.paymentStatus !== "Paid" && (              
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
    
)}

      {/* HISTORY SECTION */}

{tab === "history" && Object.keys(groupedHistory).length > 0 && (
  <>
  <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">

  <input
    type="text"
    placeholder="Search by dog or service..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="px-4 py-2 border rounded-lg w-full md:w-1/3"
  />

  <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    className="px-4 py-2 border rounded-lg"
  />

  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    className="px-4 py-2 border rounded-lg"
  />

</div>
    <h2 className="text-3xl font-bold text-center mt-16">
      Booking History
    </h2>

    {Object.entries(groupedHistory).map(([month, bookings]) => (
      <div key={month} className="mt-10">

        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          {month}
        </h3>

{!isCompactView ? (
  <div className="grid md:grid-cols-2 gap-6">
              {bookings.map(booking => (
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
                📅 {new Date(booking.date).toDateString()}
              </p>

              <p className="text-xs text-gray-400">
                Booked on: {new Date(booking.createdAt).toDateString()}
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
) : (
  <div className="space-y-3">

    {bookings.map(booking => (
      <div
        key={booking._id}
        className="flex justify-between items-center bg-white border rounded-lg px-4 py-3"
      >

        <div>
          <p className="font-semibold">
            {booking.pet?.name} • {booking.service?.category}
          </p>

          <p className="text-sm text-gray-500">
            📅 {new Date(booking.date).toDateString()} • {booking.timeSlot}
          </p>

          <p className="text-xs text-gray-400">
            Booked: {new Date(booking.createdAt).toDateString()}
          </p>
        </div>

        <p className="font-semibold text-gray-700">
          ₹{booking.finalPrice}
        </p>

      </div>
    ))}

  </div>
)}
      </div>
      
    ))}
  </>
)}

    </div>
  )
}