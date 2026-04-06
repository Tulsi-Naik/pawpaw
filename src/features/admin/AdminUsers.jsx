import { useEffect, useState } from "react"
import React from "react"

export default function AdminUsers() {

  const token = localStorage.getItem("token")

  const [users, setUsers] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const data = await res.json()
      setUsers(data)

    } catch {
      console.log("Error loading users")
    }
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }
const sortedUsers = [...users].sort(
  (a, b) => (b.totalSpent || 0) - (a.totalSpent || 0)
)

const topCount = Math.ceil(sortedUsers.length * 0.1)
const topUserIds = new Set(
  sortedUsers.slice(0, topCount).map(u => u._id)
)
  return (
    <div>

      {/* Summary */}
      <div className="mb-6 text-sm text-gray-600">
        Total Users: {users.length}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th>City</th>
              <th>Has Dog</th>
              <th>Bookings</th>
              <th>Spent</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {sortedUsers.map(u => (
              <React.Fragment key={u._id}>

                <tr className="border-t">

<td className="p-3">
  {u.name}
  {topUserIds.has(u._id) && (
    <span className="ml-2 text-xs text-green-600">💎 Top</span>
  )}
</td>
                  <td>{u.city}</td>

                  <td>{u.hasDog ? "Yes" : "No"}</td>

                  <td>{u.totalBookings || 0}</td>

                  <td>₹{u.totalSpent || 0}</td>

                  <td>
                    {new Date(u.createdAt).toDateString()}
                  </td>

                  <td>
                    <button
                      onClick={() => toggleExpand(u._id)}
                      className="text-orange-500"
                    >
                      {expandedId === u._id ? "▲" : "▼"}
                    </button>
                  </td>

                </tr>

                {expandedId === u._id && (
                  <tr className="bg-gray-50">
                    <td colSpan="7" className="p-4">

                      <div className="grid md:grid-cols-2 gap-4 text-sm">

                        <div>
                          <p><b>Email:</b> {u.email}</p>
                          <p><b>Phone:</b> {u.phone}</p>
                        </div>

                        <div>
                          <p><b>Total Bookings:</b> {u.totalBookings}</p>
                          <p><b>Total Spent:</b> ₹{u.totalSpent}</p>
                        </div>

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