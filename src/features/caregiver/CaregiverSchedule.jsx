import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

export default function CaregiverSchedule() {
  const token = localStorage.getItem("token")
  const [bookings, setBookings] = useState([])
  const [date, setDate] = useState(new Date())
const [watchId, setWatchId] = useState(null)
const [lastLocation, setLastLocation] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/my-assignments`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBookings(data))
  }, [token])



  const tileClassName = ({ date }) => {
    const bookingDates = bookings.map(b =>
      new Date(b.date).toDateString()
    )

    if (bookingDates.includes(date.toDateString())) {
      return "bg-green-400 text-white rounded-full"
    }
  }
const startTracking = (bookingId) => {

  // stop old tracking if exists
  if (watchId) {
    navigator.geolocation.clearWatch(watchId)
  }

  const id = navigator.geolocation.watchPosition(
    async (position) => {

const lat = position.coords.latitude
const lng = position.coords.longitude

if (lastLocation) {

  const from = turf.point([lastLocation.lng, lastLocation.lat])
  const to = turf.point([lng, lat])

  const moved = turf.distance(from, to, { units: "meters" })

  if (moved < 20) return
}

setLastLocation({ lat, lng })

await fetch(`${import.meta.env.VITE_API_URL}/api/location/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId,
          lat,
          lng
        })
      })

    },
    (err) => console.log("GPS error", err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  )

  setWatchId(id)
}
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

return (
  <div>
    <h1 className="text-3xl font-bold mb-6">
      My Schedule 📅
    </h1>

    <Calendar
      onChange={setDate}
      value={date}
      tileContent={({ date }) => {
        const bookingsOnDay = bookings.filter(
          b =>
            new Date(b.date).toDateString() ===
            date.toDateString()
        )

        if (bookingsOnDay.length === 0) return null

        return (
          <div className="flex justify-center mt-1">
            <div
              className={`w-2 h-2 rounded-full ${
                bookingsOnDay.length >= 3
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            />
          </div>
        )
      }}
    />

    <h2 className="text-xl font-bold mt-8">
      Appointments on {date.toDateString()}
    </h2>

    <div className="mt-4">

      {bookings.filter(
        b =>
          new Date(b.date).toDateString() ===
          date.toDateString()
      ).length === 0 ? (

        <div className="bg-white p-6 rounded-xl shadow text-gray-500 text-center">
          No appointments for this day
        </div>

      ) : (

        <div className="space-y-4">

          {bookings
            .filter(
              b =>
                new Date(b.date).toDateString() ===
                date.toDateString()
            )
            .map(b => (

              <div
                key={b._id}
                className="bg-white border rounded-2xl shadow-sm p-5 flex flex-col gap-3"
              >

                {/* DOG */}
                <div>
                 <h3 className="font-bold text-lg">
  🐕 {b.pet?.name}
</h3>

<p className="text-sm text-gray-500">
  {b.pet?.breed || "Unknown"}
  {b.pet?.dateOfBirth && (
    <> • {getDogAge(b.pet.dateOfBirth)} yrs</>
  )}
</p>
                </div>

                {/* JOB INFO */}
                <div className="text-sm text-gray-700 flex flex-wrap gap-x-4 gap-y-1">

                  <span>
                    📅 {new Date(b.date).toDateString()}
                  </span>

                  <span>
                    ⏰ {b.timeSlot}
                  </span>

                  <span>
                    ⏱ {b.duration} mins
                  </span>

                  <span>
                    📍 {b.pet?.owner?.city}
                  </span>

                </div>

                {/* DOG NOTES */}
                <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1">

                  <span>
                    ⚡ Energy {b.pet?.energyLevel ?? 3}/5
                  </span>

                  <span>
                    🚶 Speed {b.pet?.walkSpeed ?? 3}/5
                  </span>

                  {b.pet?.allergies && (
                    <span className="text-red-500">
                      ⚠ {b.pet.allergies}
                    </span>
                  )}

                  {b.pet?.fears?.length > 0 && (
                    <span>
                      😟 {b.pet.fears.join(", ")}
                    </span>
                  )}

                </div>

                {/* ACTION */}
                <div className="mt-2">

                  {b.status === "Accepted" && (
                    <button
                      onClick={async () => {

                        await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${b._id}/start`, {
                          method: "PUT",
                          headers: { Authorization: `Bearer ${token}` }
                        })

                        startTracking(b._id)

                        setBookings(prev =>
                          prev.map(item =>
                            item._id === b._id
                              ? { ...item, status: "InProgress" }
                              : item
                          )
                        )

                      }}
                      className="w-full bg-green-500 text-white py-2 rounded-lg"
                    >
                      Start Walk
                    </button>
                  )}

                  {b.status === "InProgress" && (
                    <button
                      onClick={async () => {

                        await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${b._id}/complete`, {
                          method: "PUT",
                          headers: { Authorization: `Bearer ${token}` }
                        })

                        if (watchId) {
                          navigator.geolocation.clearWatch(watchId)
                        }

                        window.location.reload()

                      }}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg"
                    >
                      Complete Walk
                    </button>
                  )}

                </div>

              </div>

            ))}

        </div>

      )}

    </div>

  </div>
)
}