import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import { useParams, useNavigate } from "react-router-dom"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import * as turf from "@turf/turf"
import { io } from "socket.io-client"

// ✅ only handles map movement
function Recenter({ position }) {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true })
    }
  }, [position])

  return null
}

export default function TrackWalkPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const [locations, setLocations] = useState([])
  const [distance, setDistance] = useState(0)
  const [connected, setConnected] = useState(false)

  const socketRef = useRef(null)

  // 🐕 custom icon
  const dogIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    iconSize: [35, 35]
  })

  // 🔥 SOCKET REAL-TIME
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL)

    socketRef.current.on("connect", () => {
      setConnected(true)
      socketRef.current.emit("join-booking", bookingId)
    })

    socketRef.current.on("receive-location", ({ lat, lng }) => {
      if (!lat || !lng) return

      setLocations(prev => {
        const updated = [...prev, [lat, lng]]

        // 📏 distance calculation
        if (updated.length > 1) {
          const line = turf.lineString(
            updated.map(p => [p[1], p[0]])
          )
          const dist = turf.length(line, { units: "kilometers" })
          setDistance(dist)
        }

        return updated
      })
    })

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [bookingId])

  // ⏳ waiting state
  if (!locations.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold">Waiting for caregiver location...</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure the walk has started 🐾
        </p>
      </div>
    )
  }

  const position = locations[locations.length - 1]

  return (
    <div className="h-screen flex flex-col">

      {/* 🔝 TOP BAR */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center z-10">

        <div>
          <p className="font-bold text-lg">Live Walk Tracking 🐾</p>
          <p className="text-sm text-gray-500">
            Distance: {distance.toFixed(2)} km
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* 🟢 connection status */}
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {connected ? "Live" : "Disconnected"}
          </span>

          <button
            onClick={() => navigate(-1)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Exit
          </button>

        </div>
      </div>

      {/* 🗺️ MAP */}
      <div className="flex-1">

        <MapContainer
          center={position}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 🛤️ path */}
          <Polyline positions={locations} color="blue" />

          {/* 🐕 marker */}
          <Marker position={position} icon={dogIcon} />

          <Recenter position={position} />
        </MapContainer>

      </div>

    </div>
  )
}