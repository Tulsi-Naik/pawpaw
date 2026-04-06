import { useEffect, useState } from "react"
import React from "react"

export default function AdminBookings() {

  const token = localStorage.getItem("token")

  const [bookings, setBookings] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  const [status, setStatus] = useState("")
  const [payment, setPayment] = useState("")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const data = await res.json()
      setBookings(data)

    } catch {
      console.log("Error loading bookings")
    }
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // filters
  const filtered = bookings.filter(b => {
    const statusMatch = status ? b.status === status : true
    const paymentMatch = payment ? b.paymentStatus === payment : true
    return statusMatch && paymentMatch
  })

  return (
    <div>

      {/* Summary */}
      <div className="flex gap-4 mb-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-xl font-bold">{bookings.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-xl font-bold">
            {bookings.filter(b => b.status === "Completed").length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Revenue</p>
          <p className="text-xl font-bold text-green-600">
            ₹{bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)}
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th>Service</th>
              <th>City</th>
              <th>Caregiver</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {filtered.map(b => (
              <React.Fragment key={b._id}>

                {/* Row */}
                <tr className="border-t">

                  <td className="p-3">
                    {new Date(b.date).toDateString()}
                  </td>

                  <td>{b.service?.category}</td>

                  <td>{b.pet?.owner?.city}</td>

                  <td>{b.caregiver?.name || "-"}</td>

                  <td>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100">
                      {b.status}
                    </span>
                  </td>

                  <td>
                    <span className={`text-xs px-2 py-1 rounded
                      ${b.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"}
                    `}>
                      {b.paymentStatus}
                    </span>
                  </td>

                  <td>₹{b.totalAmount || 0}</td>

                  <td>
                    <button
                      onClick={() => toggleExpand(b._id)}
                      className="text-orange-500"
                    >
                      {expandedId === b._id ? "▲" : "▼"}
                    </button>
                  </td>

                </tr>

                {/* Expand */}
                {expandedId === b._id && (
                  <tr className="bg-gray-50">
                    <td colSpan="8" className="p-4">

                      <div className="grid md:grid-cols-3 gap-4 text-sm">

                        <div>
                          <p><b>Owner:</b> {b.pet?.owner?.name}</p>
                          <p><b>Pet:</b> {b.pet?.name}</p>
                        </div>

                        <div>
                          <p><b>Time:</b> {b.timeSlot}</p>
                          <p><b>Duration:</b> {b.duration} min</p>
                        </div>

                        <div>
                          <p><b>Caregiver Earning:</b> ₹{b.caregiverEarning}</p>
                          <p><b>Platform Fee:</b> ₹{b.platformFee}</p>
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