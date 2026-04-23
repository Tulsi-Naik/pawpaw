import { useEffect, useState } from "react"

export default function AdminCaregiversReport() {

  const [data, setData] = useState([])
  const [sort, setSort] = useState("desc")

  // 🔹 Fetch
  const fetchData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/caregiver-stats`
      )
      const json = await res.json()
      setData(json)
    } catch {
      console.log("Error loading caregiver stats")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 🔹 Sorting (IMPORTANT FIX)
  const sorted = [...data].sort((a, b) => {
    const aRating = a.avgRating ?? -1   // null goes LAST
    const bRating = b.avgRating ?? -1

    return sort === "desc"
      ? bRating - aRating
      : aRating - bRating
  })

  // 🔹 Rated vs Unrated %
  const totalCaregivers = data.length
  const ratedCount = data.filter(c => c.avgRating !== null).length
  const unratedCount = totalCaregivers - ratedCount

  const ratedPercent = totalCaregivers
    ? ((ratedCount / totalCaregivers) * 100).toFixed(1)
    : 0

  const unratedPercent = totalCaregivers
    ? ((unratedCount / totalCaregivers) * 100).toFixed(1)
    : 0

  // 🔹 CSV Export
  const exportCSV = () => {
    const rows = [
      ["Rank", "Name", "Avg Rating", "Reviews", "Bookings", "Status"],
      ...sorted.map((c, i) => {
        const rating = c.avgRating
        let status = "No Reviews Yet"

        if (rating !== null) {
          status = rating < 3 ? "Needs Attention" : "Good"
        }

        return [
          i + 1,
          c.name,
          rating ?? "Not Rated",
          c.totalReviews,
          c.totalBookings,
          status
        ]
      })
    ]

    const csv =
      "data:text/csv;charset=utf-8," +
      rows.map(r => r.join(",")).join("\n")

    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", "caregiver-performance-report.csv")
    document.body.appendChild(link)
    link.click()
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Caregiver Performance 📊
        </h1>

        <button
          onClick={exportCSV}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
        >
          Export CSV
        </button>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-4">

        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Rated Caregivers</p>
          <p className="text-xl font-bold text-green-600">
            {ratedCount} ({ratedPercent}%)
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Unrated Caregivers</p>
          <p className="text-xl font-bold text-red-600">
            {unratedCount} ({unratedPercent}%)
          </p>
        </div>

      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex gap-4">

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="desc">Top Performers</option>
          <option value="asc">Lowest Rated</option>
        </select>

      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Rank</th>
              <th>Name</th>
              <th>Avg Rating</th>
              <th>Reviews</th>
              <th>Bookings</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              sorted.map((c, i) => {
                const rating = c.avgRating

                let status = "No Reviews Yet"
                let style = "bg-gray-100 text-gray-600"

                if (rating !== null) {
                  if (rating < 3) {
                    status = "Needs Attention"
                    style = "bg-red-100 text-red-600"
                  } else {
                    status = "Good"
                    style = "bg-green-100 text-green-600"
                  }
                }

                return (
                  <tr key={i} className="border-t hover:bg-gray-50">

                    <td className="p-4 font-medium">
                      #{i + 1}
                    </td>

                    <td className="font-medium">
                      {c.name}
                    </td>

                    <td>
                      {rating === null ? "Not Rated" : rating}
                    </td>

                    <td>{c.totalReviews}</td>

                    <td>{c.totalBookings}</td>

                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
                        {status}
                      </span>
                    </td>

                  </tr>
                )
              })
            )}
          </tbody>

        </table>

      </div>

    </div>
  )
}