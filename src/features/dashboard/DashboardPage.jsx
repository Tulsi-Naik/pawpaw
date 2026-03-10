import { useEffect, useState } from "react"

export default function DashboardPage() {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  const [pets, setPets] = useState([])
  const [bookings, setBookings] = useState([])

  const upcomingBookings = bookings.filter(
  b => new Date(b.date) >= new Date() && b.status !== "Cancelled" && b.status !== "Completed"
) 
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/pets/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPets(data))

    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBookings(data))
  }, [])

  return (
    <div className="p-8">

   

      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-600 mt-2">
{pets.length} Dogs • {upcomingBookings.length} Upcoming        </p>
      </div>

      {/* Dogs */}
      <h2 className="text-xl font-bold mb-4">Your Dogs</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {pets.map(pet => (
          <div key={pet._id} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg">{pet.name}</h3>
            <p className="text-gray-500">{pet.breed}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>
      <div className="space-y-4">
{upcomingBookings.map(booking => (          <div key={booking._id} className="bg-white p-6 rounded-2xl shadow flex justify-between">
            <div>
              <p className="font-semibold">
                {booking.service?.name}
              </p>
              <p className="text-gray-500">
                {new Date(booking.date).toDateString()}
              </p>
            </div>
            <span className="text-orange-500 font-semibold">
              {booking.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}