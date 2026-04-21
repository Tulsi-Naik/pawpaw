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
  }, [token])

  return (
    <div className="max-w-5xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        🐶 My Adoption Requests
      </h1>

      {requests.length === 0 && (
        <p className="text-gray-500">No requests yet</p>
      )}

      <div className="space-y-6">

        {requests.map(r => (
          <div key={r._id} className="bg-white p-5 rounded-2xl shadow space-y-3 border">

            {/* PET INFO */}
            <div>
              <p className="font-semibold text-lg">
                {r.listing?.pet?.name}
              </p>

              <p className="text-sm text-gray-500">
                {r.listing?.pet?.breed}
              </p>
            </div>

            {/* YOUR MESSAGE */}
            <div className="bg-orange-50 p-3 rounded-lg text-sm">
              <p className="font-medium text-orange-600 mb-1">
                Your Message
              </p>
              <p className="italic text-gray-700">
                {r.message || "No message added"}
              </p>
            </div>

            {/* YOUR BIO */}
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <p className="font-medium text-gray-500 mb-1">
                Your Profile
              </p>
              <p className="text-gray-700">
                {r.requester?.bio || "No bio added"}
              </p>
            </div>

            {/* STATUS + DATE */}
            <div className="flex justify-between items-center pt-2">
              <p className="text-sm capitalize font-medium">
                Status: {r.status}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}