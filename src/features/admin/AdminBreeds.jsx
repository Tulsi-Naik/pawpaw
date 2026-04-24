import { useEffect, useState } from "react"
//
export default function AdminBreeds() {
//
  const [breeds, setBreeds] = useState([])
  const [size, setSize] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sort, setSort] = useState("desc")

  // 🔹 Derived data
  const total = breeds.reduce((sum, b) => sum + b.count, 0)

  const sortedBreeds = [...breeds].sort((a, b) =>
    sort === "desc" ? b.count - a.count : a.count - b.count
  )

  // 🔹 Fetch
  const fetchData = async () => {
    try {
      const query = new URLSearchParams()

      if (size) query.append("size", size)
      if (startDate) query.append("startDate", startDate)
      if (endDate) query.append("endDate", endDate)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/breed-stats?${query}`
      )

      const data = await res.json()
      setBreeds(data)

    } catch {
      console.log("Error loading breed data")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 🔹 CSV Export (Excel safe + correct)
  const exportCSV = () => {
    const rows = [
      ["Rank", "Breed", "Count", "Share (%)"],
      ...sortedBreeds.map((b, i) => [
        i + 1,
        b._id,
        b.count,
        total ? ((b.count / total) * 100).toFixed(2) : "0.00"
      ])
    ]

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map(r => r.join(",")).join("\n")

    const fileName = `breed-report_${size || "all"}_${startDate || "start"}_${endDate || "end"}.csv`

    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", fileName)
    document.body.appendChild(link)
    link.click()
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Breed Analysis 🐶</h1>

        <button
          onClick={exportCSV}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap bg-white p-4 rounded-xl shadow-sm">

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="desc">Top Breeds</option>
          <option value="asc">Least Common</option>
        </select>

        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Sizes</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />

        <button
          onClick={fetchData}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Apply
        </button>

      </div>

      {/* Summary */}
      <div className="text-sm text-gray-600">
        Total Dogs: <b>{total}</b> | Unique Breeds: <b>{breeds.length}</b>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Rank</th>
              <th>Breed</th>
              <th>Total</th>
              <th>Share %</th>
            </tr>
          </thead>

          <tbody>
            {sortedBreeds.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              sortedBreeds.map((b, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">

                  <td className="p-4 font-medium">
                    #{i + 1}
                  </td>

                  <td className="font-medium">
                    {b._id || "Unknown"}
                  </td>

                  <td>
                    {b.count}
                  </td>

                  <td>
                    {total
                      ? ((b.count / total) * 100).toFixed(2)
                      : "0.00"}%
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>

    </div>
  )
}
//