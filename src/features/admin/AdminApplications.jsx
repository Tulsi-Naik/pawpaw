import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"

export default function AdminApplications() {

  const [apps,setApps] = useState([])
  const [open,setOpen] = useState(null)
  const [status,setStatus] = useState("pending")
  const [pendingCount,setPendingCount] = useState(0)
  const [rejectId,setRejectId] = useState(null)
const [rejectReason,setRejectReason] = useState("")
  const loadApps = async () => {
    try{
      const res = await axios.get(`${process.env.VITE_API_URL}/api/applications?status=${status}`)
      setApps(res.data)
    }catch{
      toast.error("Failed to load applications")
    }
  }

  const loadPendingCount = async () => {
    try{
      const res = await axios.get(`${process.env.VITE_API_URL}/api/applications?status=pending`)
      setPendingCount(res.data.length)
    }catch{}
  }

  const approve = async (id) => {
    try{
      await axios.put(`${process.env.VITE_API_URL}/api/applications/${id}/approve`)
      toast.success("Application approved")
      loadApps()
      loadPendingCount()
    }catch{
      toast.error("Approval failed")
    }
  }

const reject = async () => {
  try{

    await axios.put(
      `${process.env.VITE_API_URL}/api/applications/${rejectId}/reject`,
      { reason: rejectReason }
    )

    toast.success("Application rejected")

    setRejectId(null)
    setRejectReason("")

    loadApps()
    loadPendingCount()

  }catch{
    toast.error("Rejection failed")
  }
}

  useEffect(()=>{
    loadApps()
    loadPendingCount()
  },[status])

  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-extrabold">
        Caregiver Applications
      </h1>

      {/* Tabs */}
      <div className="flex gap-4">

        <button
          onClick={()=>setStatus("pending")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            status === "pending"
            ? "bg-orange-500 text-white"
            : "bg-gray-100"
          }`}
        >
          Pending
          {pendingCount > 0 && (
            <span className="ml-2 bg-white text-orange-500 px-2 py-0.5 rounded-full text-xs">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={()=>setStatus("approved")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            status === "approved"
            ? "bg-green-500 text-white"
            : "bg-gray-100"
          }`}
        >
          Approved
        </button>

        <button
          onClick={()=>setStatus("rejected")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            status === "rejected"
            ? "bg-red-500 text-white"
            : "bg-gray-100"
          }`}
        >
          Rejected
        </button>

      </div>

      {apps.length === 0 && (
        <p className="text-gray-500">No applications</p>
      )}

      {/* Application list */}
      <div className="bg-white rounded-2xl shadow divide-y">

        {apps.map(app => (

          <div key={app._id}>

            {/* Collapsed Row */}
            <div
              onClick={()=>setOpen(open === app._id ? null : app._id)}
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50"
            >

              <div className="flex items-center gap-4">

                {app.profilePhoto && (
                  <img
                    src={app.profilePhoto}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}

                <div>
                  <p className="font-semibold">{app.name}</p>
                  <p className="text-sm text-gray-500">{app.email}</p>
                </div>

              </div>

              <div className="text-sm text-gray-500 flex gap-6 items-center">

                <span>{app.city}</span>
                <span>{app.skills.join(", ")}</span>
                <span>{app.experienceYears} yrs</span>

                <span className="text-gray-400">
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>

              </div>

            </div>

            {/* Expanded Details */}
            {open === app._id && (

              <div className="p-6 bg-gray-50 space-y-6">

                <div className="grid md:grid-cols-2 gap-6 text-sm">

                  <div className="space-y-2">
                    <p><b>Phone:</b> {app.phone}</p>
                    <p><b>Availability:</b> {app.availability.join(", ")}</p>
                    <p><b>ID Type:</b> {app.idProofType}</p>
                    <p><b>ID Number:</b> {app.idProofNumber}</p>
                  </div>

                  <div className="space-y-2">

                    {app.referenceName && (
                      <p><b>Reference:</b> {app.referenceName}</p>
                    )}

                    {app.referencePhone && (
                      <p><b>Reference Phone:</b> {app.referencePhone}</p>
                    )}

                  </div>

                </div>

                {app.experienceDetails && (
                  
                  <div>
                    <p className="font-semibold mb-1">Experience</p>
                    <p className="text-gray-600 text-sm">
                      {app.experienceDetails}
                    </p>
                  </div>
                  
                )}
                {app.decisionInfo?.rejectionReason && (
  <div>
    <p className="font-semibold mb-1 text-red-600">Rejection Reason</p>
    <p className="text-sm text-gray-600">
      {app.decisionInfo.rejectionReason}
    </p>
  </div>
)}

                {app.idProofImage && (
                  <div>
                    <p className="font-semibold mb-2">ID Proof</p>

                    <img
                      src={app.idProofImage}
                      alt="ID"
                      className="w-64 rounded-lg border"
                    />
                  </div>
                )}

                {status === "pending" && (
                  <div className="flex gap-4 pt-4 border-t">

                    <button
                      onClick={()=>approve(app._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                    >
                      Approve
                    </button>

                    <button
onClick={()=>setRejectId(app._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
                    >
                      Reject
                    </button>

                  </div>
                )}

              </div>

            )}

          </div>
          

        ))}
        {rejectId && (

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-xl p-6 w-100 space-y-4">

      <h2 className="text-xl font-bold">
        Reject Application
      </h2>

      <textarea
        placeholder="Enter rejection reason..."
        value={rejectReason}
        onChange={(e)=>setRejectReason(e.target.value)}
        className="w-full border rounded-lg p-3 text-sm h-24"
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={()=>setRejectId(null)}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={reject}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Reject
        </button>

      </div>

    </div>

  </div>

)}

      </div>

      

    </div>
    
  )
}