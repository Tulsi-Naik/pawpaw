import { useEffect, useState } from "react"
import React from "react"

export default function AdminCaregivers() {

  const token = localStorage.getItem("token")

  const [caregivers, setCaregivers] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  const [search, setSearch] = useState("")
  const [city, setCity] = useState("")
  const [skill, setSkill] = useState("")
  const [status, setStatus] = useState("")
const [sort, setSort] = useState("top") // top | new

  useEffect(() => {
    fetchCaregivers()
  }, [search, city, skill, status])

  const fetchCaregivers = async () => {
    try {
 const query = new URLSearchParams()

if (search) query.append("search", search)
if (city) query.append("city", city)
if (skill) query.append("skill", skill)
if (status) query.append("status", status)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/caregivers?${query}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const data = await res.json()
      setCaregivers(data)

    } catch {
      console.log("Error loading caregivers")
    }
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const toggleStatus = async (id) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/caregivers/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchCaregivers()

    } catch {
      console.log("Error updating status")
    }
  }
  let sortedCaregivers = [...caregivers]

if (sort === "top") {
  sortedCaregivers.sort((a, b) => (b.totalBookings || 0) - (a.totalBookings || 0))
} else {
  sortedCaregivers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

  return (
    <div>
        <div className="flex gap-3 mb-4">

  {["", "Active", "Pending", "Blocked"].map(s => (
    <button
      key={s}
      onClick={() => setStatus(s)}
      className={`px-4 py-2 rounded-full border
        ${status === s ? "bg-orange-500 text-white" : "bg-white"}
      `}
    >
      {s || "All"}
    </button>
  ))}

</div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">

        <input
          placeholder="Search name/email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />

        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Skills</option>
          <option value="walking">Walking</option>
          <option value="grooming">Grooming</option>
        </select>

        <select
  value={sort}
  onChange={(e) => setSort(e.target.value)}
  className="border px-3 py-2 rounded-lg"
>
  <option value="top">Top Performers</option>
  <option value="new">Newest</option>
</select>

      </div>

      <div className="mb-4 text-sm text-gray-600">
  Total: {caregivers.length}
</div>
     {caregivers.length === 0 && (
  <p className="text-gray-500">No caregivers found</p>
)} 

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th>City</th>
              <th>Skills</th>
              <th>Price</th>
              <th>Status</th>
              <th>Jobs</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

{sortedCaregivers.map(cg => (
                  <React.Fragment key={cg._id}>

                {/* Main Row */}
                <tr className="border-t">

<td className="p-3 font-medium">
  {cg.name}
  {cg.totalBookings > 10 && (
    <span className="text-xs text-green-600 ml-2">🔥 Top</span>
  )}
</td>
                  <td>{cg.city}</td>

                  <td><div className="flex gap-1 flex-wrap">
  {cg.skills?.map(s => (
    <span key={s} className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs">
      {s}
    </span>
  ))}
</div></td>

                  <td>
                    ₹{cg.walkingPrice || 0} / ₹{cg.groomingPrice || 0}
                  </td>

                  <td>
                    <span className={`text-xs px-2 py-1 rounded-full
                      ${cg.onboardingStatus === "active" && "bg-green-100 text-green-600"}
                      ${cg.onboardingStatus === "pending_setup" && "bg-yellow-100 text-yellow-600"}
                      ${cg.onboardingStatus === "suspended" && "bg-red-100 text-red-600"}
                    `}>
                      {cg.onboardingStatus}
                    </span>
                  </td>

                  <td>{cg.totalBookings || 0}</td>

                  <td>
                    <button
                      onClick={() => toggleExpand(cg._id)}
                      className="text-orange-500"
                    >
                      {expandedId === cg._id ? "▲" : "▼"}
                    </button>
                  </td>

                </tr>

                {/* Expanded Row */}
                {expandedId === cg._id && (
                  <tr className="bg-gray-50">
                    <td colSpan="7" className="p-4">

                      <div className="grid md:grid-cols-3 gap-4 text-sm">

                        <div>
                          <p><b>Radius:</b> {cg.serviceRadius || "-"} km</p>
                          <p><b>Availability:</b> {cg.availability?.join(", ")}</p>
                        </div>

                        <div>
                          <p><b>Completed:</b> {cg.completedBookings}</p>
                          <p><b>Earnings:</b> ₹{cg.earnings}</p>
                        </div>

                        <div>
                          <p><b>Phone:</b> {cg.phone}</p>
                          <p><b>UPI:</b> {cg.upiId || "-"}</p>
                        </div>

                      </div>

                      {/* Action Button */}
                      <div className="mt-4">
                        <button
                          onClick={() => toggleStatus(cg._id)}
                          className={`px-4 py-2 rounded-lg text-white
                            ${cg.onboardingStatus === "suspended"
                              ? "bg-green-500"
                              : "bg-red-500"
                            }
                          `}
                        >
                          {cg.onboardingStatus === "suspended"
                            ? "Activate"
                            : "Suspend"}
                        </button>
                      </div>

                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}