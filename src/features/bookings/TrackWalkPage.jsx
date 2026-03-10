import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import { useParams, useNavigate } from "react-router-dom"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import * as turf from "@turf/turf"

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
  const token = localStorage.getItem("token")

  const [locations, setLocations] = useState([])
  const [distance, setDistance] = useState(0)

  const dogIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    iconSize: [35, 35]
  })

  useEffect(() => {

    const interval = setInterval(async () => {

      const res = await fetch(
        `${process.env.VITE_API_URL}/api/location/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const data = await res.json()

      if (data?.length) {

        const path = data.map(p => [p.lat, p.lng])
        setLocations(path)

        const line = turf.lineString(
          path.map(p => [p[1], p[0]])
        )

        const dist = turf.length(line, { units: "kilometers" })
        setDistance(dist)
      }

    }, 5000)

    return () => clearInterval(interval)

  }, [bookingId, token])

  if (!locations.length) {
    return <div className="p-10">Waiting for caregiver location...</div>
  }

  const position = locations[locations.length - 1]

  return (
    <div className="max-w-4xl mx-auto p-4">

      <div className="flex justify-between items-center mb-4">

        <p className="font-semibold text-lg">
          Distance walked: {distance.toFixed(2)} km
        </p>

        <button
          onClick={() => navigate(-1)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop Tracking
        </button>

      </div>

      <div className="h-125 rounded-xl overflow-hidden border">

        <MapContainer
          center={position}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Polyline positions={locations} color="blue" />

          <Marker position={position} icon={dogIcon} />

          <Recenter position={position} />

        </MapContainer>

      </div>

    </div>
  )
}