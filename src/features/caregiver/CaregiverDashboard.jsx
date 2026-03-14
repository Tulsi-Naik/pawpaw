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

const getDogAge = (dob) => {
  if (!dob) return null

  const birth = new Date(dob)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

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
  🐕 {booking.pet?.name}
</h3>

<p className="text-sm text-gray-600">
Breed: {booking.pet?.breed || "Unknown"}
{booking.pet?.dateOfBirth && (
  <> • Age: {getDogAge(booking.pet.dateOfBirth)} yrs</>
)}</p>

<p className="text-sm text-gray-600">
  ⚡ Energy: {booking.pet?.energyLevel ?? 3}/5 •
  🚶 Walk Speed: {booking.pet?.walkSpeed ?? 3}/5
</p>

{booking.pet?.allergies && (
  <p className="text-sm text-red-500">
    ⚠ Allergies: {booking.pet.allergies}
  </p>
)}

{booking.pet?.fears?.length > 0 && (
  <p className="text-sm text-gray-600">
    😟 Fears: {booking.pet.fears.join(", ")}
  </p>
)}

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
  className="bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition"
>

  {/* HEADER */}
  <div className="flex justify-between items-center">

    <div>
      <h3 className="font-bold text-lg">
        🐕 {booking.pet?.name}
      </h3>

      <p className="text-sm text-gray-500">
        {booking.pet?.breed || "Unknown"}
          {booking.pet?.dateOfBirth && (
    <> • {getDogAge(booking.pet.dateOfBirth)} yrs</>
  )}
      </p>
    </div>

    <span className="text-xs font-semibold text-blue-600">
      {booking.service?.category === "walking"
        ? "DOG WALK"
        : "GROOMING"}
    </span>

  </div>

  {/* APPOINTMENT */}
  <div className="text-sm text-gray-700 flex flex-wrap gap-x-4 gap-y-1">

    <span>
      📅 {new Date(booking.date).toDateString()}
    </span>

    <span>
      ⏰ {booking.timeSlot}
    </span>

    <span>
      ⏱ {booking.duration} mins
    </span>

    <span>
      📍 {booking.pet?.owner?.city}
    </span>

  </div>

  {/* DOG TRAITS */}
  <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1">

    <span>
      ⚡ Energy {booking.pet?.energyLevel ?? 3}/5
    </span>

    <span>
      🚶 Speed {booking.pet?.walkSpeed ?? 3}/5
    </span>

    {booking.pet?.allergies && (
      <span className="text-red-500">
        ⚠ {booking.pet.allergies}
      </span>
    )}

  </div>

  {/* PRICE + ACTION */}
  <div className="flex justify-between items-center mt-2">

    <p className="font-bold text-orange-600">
      ₹{booking.finalPrice}
    </p>

    <button
      onClick={() => handleAccept(booking._id)}
      className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600"
    >
      Accept
    </button>

  </div>

</div>
          ))}
      </div>

    </div>
  )
}