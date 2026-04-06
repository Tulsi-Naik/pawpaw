import { useEffect, useState } from "react"

export default function MyRequests() {
  const token = localStorage.getItem("token")

  const [requests, setRequests] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/adoption/my-requests`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setRequests)
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        🐶 My Adoption Requests
      </h1>

      {requests.length === 0 && (
        <p className="text-gray-500">No requests yet</p>
      )}

      <div className="space-y-4">

        {requests.map(r => (
          <div key={r._id} className="bg-white p-4 rounded-xl shadow">

            <p className="font-semibold">
              {r.listing?.pet?.name}
            </p>

            <p className="text-sm text-gray-500">
              {r.listing?.pet?.breed}
            </p>

            <p className="text-sm mt-1 capitalize">
              Status: {r.status}
            </p>

          </div>
        ))}

      </div>
    </div>
  )
}