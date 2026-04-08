import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function MyListings() {
  const token = localStorage.getItem("token")

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/adoption/my-listings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => {
        setData(res)
        setLoading(false)
      })
  }, [])

  const handleAction = async (requestId, action) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/adoption/request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ action })
        }
      )

      const data = await res.json()

      if (res.ok) {
        toast.success(data.message)
        window.location.reload()
      } else {
        toast.error(data.message)
      }

    } catch {
      toast.error("Error")
    }
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        🐶 My Adoption Listings
      </h1>

      {data.length === 0 && (
        <p className="text-gray-500">No listings yet</p>
      )}

      <div className="space-y-8">

        {data.map(item => {
          const { listing, requests } = item

          return (
            <div key={listing._id} className="bg-white rounded-3xl shadow-lg overflow-hidden">

              {/* Dog Header */}
              <div className="flex gap-4 p-6 border-b">

                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200">
                  {listing.pet?.profilePhoto ? (
                    <img
                      src={listing.pet.profilePhoto}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      🐶
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <h2 className="text-xl font-bold">
                    {listing.pet?.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {listing.pet?.breed}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {requests.length} request{requests.length !== 1 && "s"}
                  </p>
                </div>

              </div>

              {/* Requests */}
              <div className="p-6 space-y-4">

                {requests.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    No requests yet
                  </p>
                ) : (
                  <>
                    {requests.map(req => {

                      console.log(req.requester)

                      return (
                        <div
                          key={req._id}
                          className="bg-gray-50 border rounded-2xl p-4 flex gap-4"
                        >

                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                            {req.requester?.profilePhoto ? (
                              <img
                                src={req.requester.profilePhoto}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                👤
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">

                            <div>
                              <p className="font-semibold">
                                {req.requester?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                📍 {req.requester?.city}
                              </p>
                            </div>

                            {/* Bio */}
                            {req.requester?.bio && (
                              <p className="text-sm mt-3 text-gray-700 bg-white p-3 rounded-lg border">
                                🧑‍🦱 <span className="font-medium">About:</span> {req.requester.bio}
                              </p>
                            )}

                            {/* Message */}
                            {req.message && (
                              <p className="text-sm mt-2 text-gray-700 bg-white p-3 rounded-lg border">
                                💬 <span className="font-medium">Why adopt:</span> {req.message}
                              </p>
                            )}

                            {/* Actions */}
                            {req.status === "pending" && (
                              <div className="flex gap-2 mt-4 justify-end">
                                <button
                                  onClick={() => handleAction(req._id, "approve")}
                                  className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm"
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() => handleAction(req._id, "reject")}
                                  className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            )}

                          </div>

                        </div>
                      )
                    })}
                  </>
                )}

              </div>

            </div>
          )
        })}

      </div>
    </div>
  )
}