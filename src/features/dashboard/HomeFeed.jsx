import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function HomeFeed() {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  const [dogOfDay, setDogOfDay] = useState(null)
  const [listings, setListings] = useState([])
  const [bookings, setBookings] = useState([])
  const [tip, setTip] = useState("")
  const [showRating, setShowRating] = useState(null)

  const tips = [
    "🐶 Walk your dog after 30 mins of meals",
    "💧 Always carry water on walks",
    "🍫 Avoid chocolate – toxic for dogs",
    "🦴 Give treats in moderation",
    "🐕 Daily walks keep dogs happy"
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listRes, bookingRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/adoption`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/bookings/my`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        const listData = await listRes.json()
        const bookingData = await bookingRes.json()

        setListings(listData.slice(0, 6))

        if (listData.length > 0) {
          setDogOfDay(
            listData[Math.floor(Math.random() * listData.length)]
          )
        }

        setBookings(bookingData)

        setTip(tips[Math.floor(Math.random() * tips.length)])

        // find last completed booking for rating
        const completed = bookingData.find(
          b => b.status === "Completed"
        )
        setShowRating(completed || null)

      } catch {
        toast.error("Error loading home")
      }
    }

    fetchData()
  }, [])

  const upcoming = bookings.filter(
    b =>
      new Date(b.date) >= new Date() &&
      b.status !== "Cancelled" &&
      b.status !== "Completed"
  )

  const handleRating = (rating) => {
    toast.success(`Rated ${rating} ⭐`)
    setShowRating(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">

      {/* Dog of the Day */}
      {dogOfDay && (
        <div
          onClick={() => navigate("/app/adopt")}
          className="bg-white rounded-2xl p-6 shadow cursor-pointer hover:shadow-md transition"
        >
          <h2 className="font-bold text-lg mb-3">
            🐶 Dog of the Day
          </h2>

          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden">
              {dogOfDay.pet?.profilePhoto && (
                <img
                  src={dogOfDay.pet.profilePhoto}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div>
              <p className="font-semibold">
                {dogOfDay.pet?.name}
              </p>
              <p className="text-sm text-gray-500">
                {dogOfDay.pet?.breed}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rate Last Walk */}
      {showRating && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="font-semibold mb-3">
            ⭐ How was your last walk?
          </p>

          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                onClick={() => handleRating(n)}
                className="text-2xl"
              >
                ⭐
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/app/book")}
          className="bg-orange-500 text-white py-3 rounded-xl"
        >
          Book Walk
        </button>

        <button
          onClick={() => navigate("/app/grooming")}
          className="bg-orange-500 text-white py-3 rounded-xl"
        >
          Groom
        </button>

        <button
          onClick={() => navigate("/app/pets")}
          className="bg-orange-500 text-white py-3 rounded-xl"
        >
          Add Pet
        </button>
      </div>

      {/* Adoption Preview */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">
            🐶 Dogs looking for a home
          </h2>

          <button
            onClick={() => navigate("/app/adopt")}
            className="text-orange-500 text-sm"
          >
            View All →
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto">
          {listings.map(item => (
            <div
              key={item._id}
              onClick={() => navigate("/app/adopt")}
              className="min-w-[200px] bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-md"
            >
              <div className="h-24 bg-gray-200 rounded mb-2 overflow-hidden">
                {item.pet?.profilePhoto && (
                  <img
                    src={item.pet.profilePhoto}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <p className="font-semibold">
                {item.pet?.name}
              </p>

              <p className="text-sm text-gray-500">
                {item.pet?.breed}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div>
        <h2 className="font-bold text-lg mb-4">
          📅 Upcoming Walks
        </h2>

        {upcoming.length === 0 ? (
          <p className="text-gray-500">
            No upcoming bookings
          </p>
        ) : (
          upcoming.slice(0, 3).map(b => (
            <div
              key={b._id}
              className="bg-white p-4 rounded-xl shadow mb-2"
            >
              <p className="font-semibold">
                {b.service?.name}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(b.date).toDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Daily Tip */}
      <div className="bg-yellow-50 p-4 rounded-xl">
        <p className="font-medium">{tip}</p>
      </div>

    </div>
  )
}