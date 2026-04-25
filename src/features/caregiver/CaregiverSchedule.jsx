import { useEffect, useRef, useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import toast from "react-hot-toast"
import { io } from "socket.io-client"
import * as turf from "@turf/turf"

export default function CaregiverSchedule() {
  const token = localStorage.getItem("token")
  const [bookings, setBookings] = useState([])
  const [date, setDate] = useState(new Date())

const socketRef = useRef(null)
const watchIdRef = useRef(null)
const lastLocationRef = useRef(null)

useEffect(() => {
  socketRef.current = io(import.meta.env.VITE_API_URL)

  return () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
    }
  }
}, [])
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/my-assignments`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBookings(data))
  }, [token])

const publishLocation = async (bookingId, position, force = false) => {
  const lat = position.coords.latitude
  const lng = position.coords.longitude

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

  const lastLocation = lastLocationRef.current

  if (lastLocation && !force) {
    const from = turf.point([lastLocation.lng, lastLocation.lat])
    const to = turf.point([lng, lat])
    const moved = turf.distance(from, to, { units: "meters" })
    if (moved < 5) return
  }

  lastLocationRef.current = { lat, lng }

  try {
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

    socketRef.current?.emit("send-location", {
      bookingId,
      lat,
      lng
    })
  } catch {
    toast.error("Location update failed")
  }
}

const startTracking = (bookingId) => {
  if (!navigator.geolocation) {
    toast.error("Location tracking is not available in this browser")
    return
  }

  if (watchIdRef.current) {
    navigator.geolocation.clearWatch(watchIdRef.current)
  }

  lastLocationRef.current = null

  // ✅ join room
  socketRef.current?.emit("join-booking", bookingId)

  navigator.geolocation.getCurrentPosition(
    (position) => publishLocation(bookingId, position, true),
    () => toast.error("Please allow location permission to start tracking"),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  )

  const id = navigator.geolocation.watchPosition(
    (position) => publishLocation(bookingId, position),
    (err) => {
      console.log("GPS error", err)
      toast.error("Unable to read live location")
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  )

  watchIdRef.current = id
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
    <div className="max-w-4xl mx-auto p-4">
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
              date.toDateString() && b.status !== "Cancelled"
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
                  className={`bg-white border rounded-2xl shadow-sm p-5 flex flex-col gap-3 ${
                    b.status === "Cancelled" ? "opacity-60 grayscale-[0.5]" : ""
                  }`}
                >
                  {/* DOG & STATUS */}
                  <div className="flex justify-between items-start">
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
                    {b.status === "Cancelled" && (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-red-200">
                        {b.cancellationReason || "Cancelled"}
                      </span>
                    )}
                  </div>

                  {/* ADDRESS SECTION */}
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">📍</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-orange-900">Pickup Address:</p>
                        <p className="text-sm text-gray-700">
                          {b.pet?.owner?.address || "Address not provided"}
                        </p>
                        <p className="text-xs text-gray-500">{b.pet?.owner?.city}</p>
                      </div>
                    </div>
                    {b.pet?.owner?.address && b.status !== "Cancelled" && (
                      <a 
                        href={`http://googleusercontent.com/maps.google.com/2{encodeURIComponent(b.pet.owner.address + ", " + b.pet.owner.city)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 block w-full text-center py-2 bg-white border border-orange-200 text-orange-600 text-xs font-bold rounded-lg hover:bg-orange-100 transition"
                      >
                        🗺️ Open in Google Maps
                      </a>
                    )}
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
                  </div>

                  {/* DOG NOTES */}
                  <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1 border-t pt-2">
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
                          toast.success("Walk started!")
                        }}
                        className="w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-600 transition"
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
                          if (watchIdRef.current) {
                            navigator.geolocation.clearWatch(watchIdRef.current)
                            watchIdRef.current = null
                            lastLocationRef.current = null
                          }
                          toast.success("Walk completed 🐾")
                          window.location.reload()
                        }}
                        className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-blue-600 transition"
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
