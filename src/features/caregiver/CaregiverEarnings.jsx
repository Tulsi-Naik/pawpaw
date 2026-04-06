import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function CaregiverEarnings() {

  const token = localStorage.getItem("token")
  const [bookings, setBookings] = useState([])
  const [monthFilter, setMonthFilter] = useState("")
const [fromDate, setFromDate] = useState("")
const [toDate, setToDate] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/caregiver`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        const data = await res.json()
        setBookings(data)

      } catch {
        toast.error("Failed to load earnings")
      }
    }

    fetchData()
  }, [])

  const paidBookings = bookings.filter(
    b => b.paymentStatus === "Paid"
  )
  const historyJobs = bookings
  .filter(b => b.status === "Completed")
  .sort((a, b) => new Date(b.date) - new Date(a.date))

  const months = [...new Set(
  historyJobs.map(b =>
    new Date(b.date).toLocaleString("en-IN", {
      month: "long",
      year: "numeric"
    })
  )
)]

const filteredJobs = historyJobs.filter(b => {
  const bookingDate = new Date(b.date)

  const monthMatch = monthFilter
    ? bookingDate.toLocaleString("en-IN", {
        month: "long",
        year: "numeric"
      }) === monthFilter
    : true

  const fromMatch = fromDate ? bookingDate >= new Date(fromDate) : true
  const toMatch = toDate ? bookingDate <= new Date(toDate) : true

  return monthMatch && fromMatch && toMatch
})

  const totalEarnings = paidBookings.reduce(
    (sum, b) => sum + (b.caregiverEarning || 0),
    0
  )

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">
        Your Earnings 💰
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="text-gray-500">Total Earned</p>
        <p className="text-3xl font-bold text-green-600">
          ₹{totalEarnings}
        </p>
      </div>
      <div className="flex flex-wrap gap-3 items-center">

  <select
    value={monthFilter}
    onChange={(e) => setMonthFilter(e.target.value)}
    className="px-3 py-2 border rounded-lg"
  >
    <option value="">All Months</option>
    {months.map(m => (
      <option key={m} value={m}>{m}</option>
    ))}
  </select>

  <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    className="px-3 py-2 border rounded-lg"
  />

  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    className="px-3 py-2 border rounded-lg"
  />

</div>

<div className="space-y-3">

  {filteredJobs.map(b => (
    <div
      key={b._id}
      className="flex justify-between items-center bg-white border rounded-lg px-4 py-3"
    >

      <div>
        <p className="font-semibold">
          {b.pet?.name} • {b.service?.category}
        </p>

        <p className="text-sm text-gray-500">
          📅 {new Date(b.date).toDateString()} • {b.timeSlot}
        </p>

        <p className="text-xs text-gray-400">
          Booked: {new Date(b.createdAt).toDateString()}
        </p>
      </div>

      <div className="text-right">
        <p className="text-green-600 font-semibold">
          +₹{b.caregiverEarning}
        </p>
      </div>

    </div>
  ))}

</div>

    </div>
  )
}