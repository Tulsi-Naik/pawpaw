import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function Adopt() {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  const [tab, setTab] = useState("browse")

  const [listings, setListings] = useState([])
  const [myListings, setMyListings] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [requestedIds, setRequestedIds] = useState([])

  const [loading, setLoading] = useState(true)
const [showModal, setShowModal] = useState(false)
const [selectedListing, setSelectedListing] = useState(null)
const [message, setMessage] = useState("")
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listRes, reqRes, myListRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/adoption`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/adoption/my-requests`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/adoption/my-listings`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        const listingsData = await listRes.json()
        const requestsData = await reqRes.json()
        const myListingsData = await myListRes.json()

        setListings(listingsData || [])
        setMyRequests(requestsData || [])
        setMyListings(myListingsData || [])
        setRequestedIds(requestsData.map(r => r.listing?._id))

        setLoading(false)

      } catch {
        toast.error("Error loading adoption")
      }
    }

    fetchData()
  }, [])

const handleRequest = async () => {
  if (!message.trim()) {
    toast.error("Please enter a reason")
    return
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/adoption/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        listingId: selectedListing,
        message
      })
    })

    const data = await res.json()

    if (res.ok) {
      toast.success("Request sent 🐶")
      setRequestedIds(prev => [...prev, selectedListing])
      setShowModal(false)
      setMessage("")
    } else {
      toast.error(data.message || "Failed")
    }

  } catch {
    toast.error("Error")
  }
}

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/adoption/request/${id}`,
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
      }

    } catch {
      toast.error("Error")
    }
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">

      <h1 className="text-3xl font-bold">
        🐶 Adoption
      </h1>

      {/* Tabs */}
      <div className="flex gap-4">
        {["browse", "myListings", "myRequests"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl
              ${tab === t
                ? "bg-orange-500 text-white"
                : "bg-gray-200"}
            `}
          >
            {t === "browse" && "Browse"}
            {t === "myListings" && "My Listings"}
            {t === "myRequests" && "My Requests"}
          </button>
        ))}
      </div>

      {/* BROWSE */}
      {tab === "browse" && (
        <>
          <button
            onClick={() => navigate("/app/adopt/create")}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl"
          >
            + List a Dog
          </button>

          {listings.length === 0 ? (
            <p className="text-gray-500">No dogs available</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {listings.map(item => {
const isRequested = requestedIds.includes(item._id)
const isOwner = item.owner === user.id || item.owner === user._id
const isProfileComplete = user?.phone && user?.city && user?.bio
                return (
                  <div key={item._id} className="bg-white p-4 rounded-xl shadow">

                    <div className="h-40 bg-gray-200 rounded mb-3 overflow-hidden">
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
{!isOwner ? (

  !isProfileComplete ? (
    <button
      onClick={() => navigate("/app/profile")}
      className="mt-3 w-full py-2 rounded bg-gray-300 text-gray-600"
    >
      Complete Profile to Request
    </button>
  ) : (
    <button
      disabled={isRequested}
      onClick={() => {
  setSelectedListing(item._id)
  setMessage("")
  setShowModal(true)
}}
      className={`mt-3 w-full py-2 rounded
        ${isRequested
          ? "bg-gray-300"
          : "bg-orange-500 text-white"}
      `}
    >
      {isRequested ? "Requested" : "Request"}
    </button>
  )

) : (
  <p className="text-xs text-gray-400 mt-3">
    Your listing
  </p>
)}

                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* MY LISTINGS */}
      {tab === "myListings" && (
        <div className="space-y-6">
          {myListings.length === 0 ? (
            <p>No listings</p>
          ) : (
            myListings.map(item => (
              <div key={item.listing._id} className="bg-white p-4 rounded-xl shadow">

                <p className="font-semibold">
                  {item.listing.pet?.name}
                </p>

                <p className="text-sm text-gray-500 mb-2">
                  Requests: {item.requests.length}
                </p>

                {item.requests.map(r => (
                  <div key={r._id} className="flex justify-between border p-2 rounded mb-2">

                    <div>
                      <p>{r.requester?.name}</p>
                      <p className="text-sm text-gray-500">
                        {r.requester?.city}
                      </p>
                    </div>

                    {r.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(r._id, "approve")}
                          className="bg-green-500 text-white px-2 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(r._id, "reject")}
                          className="bg-red-500 text-white px-2 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm">{r.status}</span>
                    )}

                  </div>
                ))}

              </div>
            ))
          )}
        </div>
      )}

      {/* MY REQUESTS */}
      {tab === "myRequests" && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <p>No requests</p>
          ) : (
            myRequests.map(r => (
              <div key={r._id} className="bg-white p-4 rounded-xl shadow">

                <p className="font-semibold">
                  {r.listing?.pet?.name}
                </p>

                <p className="text-sm text-gray-500">
                  {r.listing?.pet?.breed}
                </p>

                <p className="text-sm mt-1">
                  Status: {r.status}
                </p>

              </div>
            ))
          )}
        </div>
      )}{showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-2xl w-full max-w-md">

      <h2 className="text-lg font-semibold mb-3">
        Why do you want to adopt?
      </h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border rounded-xl p-3 h-24"
        placeholder="Tell the owner why you'd be a good match..."
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Cancel
        </button>

       <button
  onClick={handleRequest}
  disabled={!message.trim()}
  className={`px-4 py-2 rounded-lg ${
    message.trim()
      ? "bg-orange-500 text-white"
      : "bg-gray-300 text-gray-500"
  }`}
>
  Send Request
</button>
      </div>

    </div>

  </div>
)}

    </div>
    
  )
}