import { useEffect, useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid
} from "recharts"

export default function AdminAnalytics() {

  const [data, setData] = useState(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const fetchData = async () => {
    try {
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
  alert("Start date cannot be after end date")
  return
}
      const query = new URLSearchParams()
      if (startDate) query.append("startDate", startDate)
      if (endDate) query.append("endDate", endDate)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/analytics?${query}`
      )
      const json = await res.json()
      setData(json)
    } catch {
      console.log("Error loading analytics")
    }
  }

  useEffect(() => {
  fetchData()
}, [startDate, endDate])

  if (!data || !data.revenue) {
    return <p className="text-red-500">Error loading analytics</p>
  }

  // 🔹 Derived insights
  const funnelData = [
    { name: "Total", value: data.funnel.totalBookings },
    { name: "Paid", value: data.funnel.paid },
    { name: "Completed", value: data.funnel.completed },
    { name: "Rated", value: data.funnel.rated }
  ]

  const ratingRate = (
    (data.funnel.rated / (data.funnel.completed || 1)) * 100
  ).toFixed(1)

  const COLORS = ["#f97316", "#22c55e", "#3b82f6", "#ef4444"]

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics 📊</h1>
<div className="flex gap-2 items-center bg-white p-4 rounded-xl shadow-sm">

  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="border px-2 py-1 rounded"
  />

  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="border px-2 py-1 rounded"
  />

  <button
    onClick={fetchData}
    className="bg-orange-500 text-white px-4 py-1 rounded"
  >
    Apply
  </button>
  

  <button
    onClick={() => {
      setStartDate("")
      setEndDate("")
fetchData()
    }}
    className="bg-gray-200 px-4 py-1 rounded"
  >
    Clear
  </button>

</div>
{(startDate || endDate) && (
  <p className="text-sm text-gray-500">
    Showing data from {startDate || "beginning"} to {endDate || "today"}
  </p>
)}
      </div>

      {/* KPI INSIGHTS */}
      <div className="grid md:grid-cols-4 gap-4">

        <Insight title="Total Revenue" value={`₹${data.revenue.totalRevenue}`} />
        <Insight title="Platform Earnings" value={`₹${data.revenue.platformRevenue}`} />
        <Insight title="Caregiver Payout" value={`₹${data.revenue.caregiverPayout}`} />
        <Insight title="Rating Rate" value={`${ratingRate}%`} />

      </div>

      {/* MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* 📈 USER GROWTH */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">User Growth Trend</h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.userTrend}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🥧 BREED DISTRIBUTION */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Breed Distribution</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.breedStats}
                dataKey="count"
                nameKey="_id"
                outerRadius={80}
              >
                {data.breedStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📉 FUNNEL */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Booking Funnel</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
  <h2 className="font-semibold mb-4">Blog Categories</h2>

  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data.blogCategories}
        dataKey="count"
        nameKey="_id"
        outerRadius={80}
      >
        {data.blogCategories.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>
<div className="bg-white p-6 rounded-xl shadow">
  <h2 className="font-semibold mb-4">Blog Publishing Trend</h2>

  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data.blogTrend}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
</div>

<div className="bg-white p-6 rounded-xl shadow">
  <h2 className="font-semibold mb-4">User Revenue Contribution</h2>

  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data.userSegmentation}
        dataKey="value"
        nameKey="name"
        outerRadius={80}
      >
        {data.userSegmentation.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>

        {/* 💡 INSIGHT PANEL */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Key Insights</h2>

          <ul className="space-y-3 text-sm text-gray-700">

            <li>📈 Revenue generated: <b>₹{data.revenue.totalRevenue}</b></li>

            <li>📊 Only <b>{ratingRate}%</b> of completed bookings are rated → improve feedback collection</li>

            <li>🐶 Top breed: <b>{data.breedStats[0]?._id}</b></li>

            <li>⚠️ Funnel drop from Paid → Completed: <b>
              {data.funnel.paid - data.funnel.completed}
            </b> bookings</li>

            <li>
  💰 Top 10% users contribute{" "}
  <b>
    {(
      (data.userSegmentation[0].value /
        (data.userSegmentation[0].value + data.userSegmentation[1].value)) *
      100
    ).toFixed(1)}%
  </b>{" "}
  of total revenue
</li>

          </ul>

        </div>

      </div>

    </div>
  )
}

/* 🔹 COMPONENT */
function Insight({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  )
}