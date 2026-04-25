import { useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet"
import { useNavigate, useParams } from "react-router-dom"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import * as turf from "@turf/turf"
import { io } from "socket.io-client"

const isValidPoint = (point) =>
  Array.isArray(point) &&
  point.length === 2 &&
  Number.isFinite(point[0]) &&
  Number.isFinite(point[1])

const samePoint = (a, b) =>
  isValidPoint(a) &&
  isValidPoint(b) &&
  a[0] === b[0] &&
  a[1] === b[1]

const normalizeLocation = (location) => {
  const lat = Number(location?.lat)
  const lng = Number(location?.lng)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  return [lat, lng]
}

function Recenter({ position }) {
  const map = useMap()

  useEffect(() => {
    if (!position) return

    map.invalidateSize()
    map.setView(position, map.getZoom(), { animate: true })
  }, [map, position])

  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 100)
    return () => window.clearTimeout(id)
  }, [map])

  return null
}

export default function TrackWalkPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [locations, setLocations] = useState([])
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const socketRef = useRef(null)

  const dogIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -35]
      }),
    []
  )

  const distance = useMemo(() => {
    if (locations.length < 2) return 0

    const line = turf.lineString(
      locations.map(point => [point[1], point[0]])
    )

    return turf.length(line, { units: "kilometers" })
  }, [locations])

  const appendLocation = (point) => {
    if (!isValidPoint(point)) return

    setLocations(prev => {
      const lastPoint = prev[prev.length - 1]
      if (samePoint(lastPoint, point)) return prev
      return [...prev, point]
    })
  }

  useEffect(() => {
    const fetchSavedLocations = async ({ showLoading = false } = {}) => {
      if (showLoading) setLoading(true)

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/location/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        if (!res.ok) throw new Error("Location fetch failed")

        const data = await res.json()
        const points = data.map(normalizeLocation).filter(Boolean)

        setLocations(prev => {
          if (!points.length) return prev

          const lastSavedPoint = points[points.length - 1]
          const lastCurrentPoint = prev[prev.length - 1]

          if (prev.length > points.length && !samePoint(lastSavedPoint, lastCurrentPoint)) {
            return [...points, lastCurrentPoint].filter(isValidPoint)
          }

          return points
        })
        setError("")
      } catch {
        setError("Unable to load caregiver location yet.")
      } finally {
        if (showLoading) setLoading(false)
      }
    }

    fetchSavedLocations({ showLoading: true })
    const pollId = window.setInterval(fetchSavedLocations, 5000)

    socketRef.current = io(import.meta.env.VITE_API_URL)

    socketRef.current.on("connect", () => {
      setConnected(true)
      socketRef.current.emit("join-booking", bookingId)
    })

    socketRef.current.on("disconnect", () => {
      setConnected(false)
    })

    socketRef.current.on("receive-location", ({ lat, lng }) => {
      appendLocation([Number(lat), Number(lng)])
    })

    return () => {
      window.clearInterval(pollId)
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [bookingId, token])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold">Loading walk tracker...</p>
      </div>
    )
  }

  if (!locations.length) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg font-semibold">Waiting for caregiver location...</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure the walk has started and location permission is allowed.
        </p>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
    )
  }

  const position = locations[locations.length - 1]

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[520px] flex flex-col overflow-hidden rounded-xl bg-white shadow">
      <div className="bg-white shadow-md p-4 flex justify-between items-center z-10">
        <div>
          <p className="font-bold text-lg">Live Walk Tracking</p>
          <p className="text-sm text-gray-500">
            Distance: {distance.toFixed(2)} km
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            connected ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}>
            {connected ? "Live" : "Polling"}
          </span>

          <button
            onClick={() => navigate(-1)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Exit
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <MapContainer
          center={position}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polyline positions={locations} color="blue" />
          <Marker position={position} icon={dogIcon} />
          <Recenter position={position} />
        </MapContainer>
      </div>
    </div>
  )
}
