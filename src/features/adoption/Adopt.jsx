import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function Adopt() {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  // State Management
  const [tab, setTab] = useState("browse")
  const [listings, setListings] = useState([])
  const [myListings, setMyListings] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [requestedIds, setRequestedIds] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals and Interaction
  const [showModal, setShowModal] = useState(false) // Request Modal
  const [selectedListing, setSelectedListing] = useState(null)
  const [message, setMessage] = useState("")

  const [confirmOpen, setConfirmOpen] = useState(false) // Approve Modal
  const [selectedRequest, setSelectedRequest] = useState(null)

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
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

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
        body: JSON.stringify({ listingId: selectedListing, message })
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
      toast.error("Error sending request")
    }
  }

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/adoption/request/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(action === "approve" ? "Adoption completed 🐶" : "Request rejected")
        
        // Update local state for immediate feedback
        setMyListings(prev =>
          prev.map(item => ({
            ...item,
            requests: item.requests.map(r => {
              if (r._id === id) return { ...r, status: action === "approve" ? "approved" : "rejected" }
              if (action === "approve") return { ...r, status: "rejected" }
              return r
            }),
            listing: action === "approve" ? { ...item.listing, status: "adopted" } : item.listing
          }))
        )
      }
    } catch {
      toast.error("Error updating request")
    }
  }

  if (loading) return <p className="p-8">Loading...</p>

  const handleFinalize = async (requestId) => {
    if (!window.confirm("Confirming this means you have physically received the dog. Proceed?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/adoption/finalize/${requestId}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}` 
        }
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Congratulations! Ownership transferred. 🐶");
        // Update local state to show 'completed'
        setMyRequests(prev => prev.map(r => 
          r._id === requestId ? { ...r, status: "completed" } : r
        ));
      } else {
        toast.error(data.message || "Transfer failed");
      }
    } catch (err) {
      toast.error("Error finalizing handover");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🐶 Adoption</h1>
        <button
          onClick={() => navigate("/app/adopt/create")}
          className="bg-orange-500 text-white px-6 py-2 rounded-xl font-medium shadow-sm hover:bg-orange-600 transition"
        >
          + List a Dog
        </button>
      </div>

      {/* Tabs Section */}
      <div className="flex gap-4 border-b pb-1">
        {["browse", "myListings", "myRequests"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-t-xl transition-all ${
              tab === t ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {t === "browse" && "Browse"}
            {t === "myListings" && "My Listings"}
            {t === "myRequests" && "My Requests"}
          </button>
        ))}
      </div>

      {/* BROWSE CONTENT */}
      {tab === "browse" && (
        <div className="space-y-6">
          {listings.length === 0 ? (
            <p className="text-gray-500">No dogs available right now.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {listings.map(item => {
                const isRequested = requestedIds.includes(item._id)
                const isOwner = item.owner === user?.id || item.owner === user?._id
                const isProfileComplete = user?.phone && user?.city && user?.bio

                return (
                  <div key={item._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="h-48 bg-gray-200 rounded-xl mb-3 overflow-hidden">
                      {item.pet?.profilePhoto ? (
                        <img src={item.pet.profilePhoto} className="w-full h-full object-cover" alt={item.pet?.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>

                    <h3 className="font-bold text-lg">{item.pet?.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{item.pet?.breed}</p>

                    {!isOwner ? (
                      !isProfileComplete ? (
                        <button
                          onClick={() => navigate("/app/profile")}
                          className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition"
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
                          className={`w-full py-2.5 rounded-xl font-medium transition ${
                            isRequested ? "bg-gray-200 text-gray-500" : "bg-orange-500 text-white hover:bg-orange-600"
                          }`}
                        >
                          {isRequested ? "Request Sent" : "Request Adoption"}
                        </button>
                      )
                    ) : (
                      <div className="text-center py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold uppercase">
                        Your Listing
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* MY LISTINGS CONTENT */}
      {tab === "myListings" && (
        <div className="grid md:grid-cols-2 gap-6">
          {myListings.length === 0 ? (
            <p className="text-gray-500 col-span-2 text-center py-10">You haven't listed any pets yet.</p>
          ) : (
            myListings.map(item => (
              <div key={item.listing._id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="flex items-center gap-4 p-4 bg-orange-50 border-b">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-orange-200 shadow-inner">
                    {item.listing.pet?.profilePhoto && (
                      <img src={item.listing.pet.profilePhoto} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{item.listing.pet?.name}</p>
                    <p className="text-sm text-orange-600">{item.listing.pet?.breed}</p>
                    {item.listing.status === "adopted" && (
                      <span className="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">
                        Adopted
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 max-h-96 overflow-y-auto space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase">Requests ({item.requests.length})</p>
                  {item.requests.length === 0 && <p className="text-sm text-gray-400 italic">No requests yet.</p>}
                  
                  {item.requests.map(req => {
                    const u = req.requester || {}
                    return (
                      <div key={req._id} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                          {u.profilePhoto ? (
                            <img src={u.profilePhoto} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-sm font-bold text-orange-400">{u.name?.charAt(0)}</div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm">{u.name}</p>
                              <p className="text-[10px] text-gray-500">📍 {u.city || "Unknown City"}</p>
                            </div>

                            {req.status === "pending" && item.listing.status === "available" && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => { setSelectedRequest(req._id); setConfirmOpen(true); }}
                                  className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-lg shadow-sm"
                                >✔</button>
                                <button
                                  onClick={() => handleAction(req._id, "reject")}
                                  className="w-7 h-7 flex items-center justify-center border bg-white text-red-500 rounded-lg"
                                >✕</button>
                              </div>
                            )}
                          </div>

                          <div className="mt-2">
                            {u.bio && <p className="text-xs text-gray-600 line-clamp-2">{u.bio}</p>}
                            {req.message && <p className="text-xs text-orange-600 italic">"{req.message}"</p>}
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                             <span className={`text-[10px] font-bold uppercase ${
                                req.status === "approved" ? "text-green-600" :
                                req.status === "rejected" ? "text-red-500" : "text-orange-500"
                              }`}>
                                {req.status}
                             </span>
                             {req.status === "approved" && u.phone && (
                               <p className="text-xs font-bold text-green-700">📞 {u.phone}</p>
                             )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MY REQUESTS CONTENT */}

{tab === "myRequests" && (
  <div className="grid md:grid-cols-2 gap-4">
    {myRequests.length === 0 ? (
      <p className="text-gray-500 text-center py-10 w-full col-span-2">No requests yet.</p>
    ) : (
      myRequests.map(r => {
        const owner = r.listing?.owner;
        const hasPhone = owner?.phone;

        return (
          <div key={r._id} className="bg-white p-4 rounded-2xl shadow-sm border flex gap-4 items-start">
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100 border">
              {r.listing?.pet?.profilePhoto ? (
                <img src={r.listing.pet.profilePhoto} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">🐶</div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg leading-tight">{r.listing?.pet?.name}</h3>
                  <p className="text-sm text-gray-500">{r.listing?.pet?.breed}</p>
                </div>
                <span // Replace the className logic for the status span:
className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
  r.status === "approved" ? "bg-green-100 text-green-700 border border-green-200" :
  r.status === "completed" ? "bg-blue-100 text-blue-700 border border-blue-200" : // 🔥 Added this
  r.status === "rejected" ? "bg-red-100 text-red-700 border border-red-200" : 
  "bg-orange-100 text-orange-700 border border-orange-200"
}`}>
                  {r.status}
                </span>
              </div>

              {r.message && r.message.trim() !== "" && (
                <p className="text-xs mt-2 text-gray-400 italic">Your message: "{r.message}"</p>
              )}

             {r.status === "approved" && (
                <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-[10px] font-bold text-green-800 uppercase mb-1">Step 2: Confirm Handover</p>
                  <p className="text-xs text-gray-600 mb-3">Once you have received the dog, click below to finalize ownership.</p>
                  
                  <button 
                    onClick={() => handleFinalize(r._id)}
                    className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-700 transition"
                  >
                    Confirm Dog Received 🐾
                  </button>

                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-[10px] font-bold text-green-800 uppercase mb-1">Owner Contact</p>
                    <p className="text-sm font-semibold text-gray-800">{owner?.name || "Pet Owner"}</p>
                    {hasPhone && (
                      <a href={`tel:${hasPhone}`} className="text-sm text-green-700 font-bold">📞 {hasPhone}</a>
                    )}
                  </div>
                </div>
              )}

              {r.status === "completed" && (
                <div className="mt-3 p-3 bg-blue-50 text-blue-700 rounded-xl text-center font-bold text-sm border border-blue-100">
                  ✅ Ownership Transferred
                </div>
              )}
            </div>
          </div>
        );
      })
    )}
  </div>
)}

      {/* REQUEST MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Why do you want to adopt?</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl p-4 h-32 focus:border-orange-500 outline-none transition"
              placeholder="Tell the owner why you'd be a good match..."
            />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold">Cancel</button>
              <button
                onClick={handleRequest}
                disabled={!message.trim()}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${
                  message.trim() ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"
                }`}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM APPROVAL MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✔</div>
            <h2 className="text-xl font-bold mb-2">Finalize Adoption?</h2>
            <p className="text-gray-500 text-sm mb-6">This will transfer ownership and reject all other pending requests for this dog.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold">Cancel</button>
              <button
                onClick={() => { handleAction(selectedRequest, "approve"); setConfirmOpen(false); }}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold shadow-lg shadow-green-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}