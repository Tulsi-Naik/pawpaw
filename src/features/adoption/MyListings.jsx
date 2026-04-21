import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function MyListings() {
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/adoption/my-listings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        setData(json);
      } catch {
        toast.error("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleAction = async (requestId, action) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/adoption/request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Error updating request");
    }
  };

  if (loading)
    return <p className="p-8 text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-extrabold mb-10">🐶 My Adoption Listings</h1>

      {data.length === 0 ? (
        <div className="bg-gray-50 border-dashed border-2 p-12 rounded-3xl text-center">
          <p className="text-gray-500">
            You haven't posted any dogs yet.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {data.map((item) => {
            const { listing, requests } = item;

            return (
              <div key={listing._id} className="bg-white rounded-3xl shadow-lg border">

                {/* DOG HEADER */}
                <div className="flex items-center gap-6 p-6 border-b bg-orange-50">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-orange-200">
                    {listing.pet?.profilePhoto ? (
                      <img
                        src={listing.pet.profilePhoto}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-3xl">
                        🐕
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      {listing.pet?.name}
                    </h2>
                    <p className="text-orange-600 font-medium">
                      {listing.pet?.breed}
                    </p>
                    <p className="text-sm text-gray-400">
                      {requests.length} requests
                    </p>
                  </div>
                </div>

                {/* REQUESTS */}
                <div className="p-8 space-y-6">
                  {requests.length === 0 ? (
                    <p className="text-gray-400 italic">
                      No requests yet
                    </p>
                  ) : (
                    requests.map((req) => {
                      const u = req.requester || {};

                      return (
                        <div
                          key={req._id}
                          className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                        >

                          {/* HEADER */}
                          <div className="flex justify-between items-start mb-4">

                            <div className="flex gap-4 items-center">
                              {/* PROFILE PHOTO */}
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100">
                                {u.profilePhoto ? (
                                  <img
                                    src={u.profilePhoto}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full font-bold text-orange-600">
                                    {u.name?.charAt(0)}
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="font-bold text-lg">{u.name}</p>
                                <p className="text-sm text-gray-500">
                                  📍 {u.city}
                                </p>
                              </div>
                            </div>

                            {/* STATUS */}
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                req.status === "pending"
                                  ? "bg-orange-100 text-orange-700"
                                  : req.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>

                          {/* BIO */}
                          {u.bio && (
                            <div className="mb-4 bg-gray-50 p-4 rounded-xl">
                              <p className="text-xs text-gray-400 mb-1">
                                Profile
                              </p>
                              <p className="text-sm">{u.bio}</p>
                            </div>
                          )}

                          {/* MESSAGE */}
                          {req.message && (
                            <div className="mb-4 bg-orange-50 p-4 rounded-xl italic">
                              "{req.message}"
                            </div>
                          )}

                          {/* CONTACT AFTER APPROVAL */}
                          {req.status === "approved" && u.phone && (
                            <p className="text-sm text-green-600 font-medium mb-4">
                              📞 {u.phone}
                            </p>
                          )}

                          {/* ACTIONS */}
                          {req.status === "pending" && (
                            <div className="flex gap-3 mt-4">
                              <button
                                onClick={() => handleAction(req._id, "approve")}
                                className="flex-1 bg-green-500 text-white py-3 rounded-xl"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(req._id, "reject")}
                                className="flex-1 border text-red-500 py-3 rounded-xl"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}