import { Users, PawPrint, ClipboardList, FileClock } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"

export default function AdminDashboard() {

  const [stats,setStats] = useState({
    users: 0,
    caregivers: 0,
    bookings: 0,
    pending: 0
  })
  const [revenue, setRevenue] = useState(null)

  const [breeds, setBreeds] = useState([])

  const loadStats = async () => {
    try{

      const [users, caregivers, bookings, apps] = await Promise.all([
axios.get(`${import.meta.env.VITE_API_URL}/api/users?role=user`),

axios.get(`${import.meta.env.VITE_API_URL}/api/users?role=caregiver`),

axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`),

axios.get(`${import.meta.env.VITE_API_URL}/api/applications?status=pending`)

        
      ])


      setStats({
        users: users.data.length,
        caregivers: caregivers.data.length,
        bookings: bookings.data.length,
        pending: apps.data.length
      })

    }catch{
      toast.error("Failed to load dashboard stats")
    }
  }

useEffect(()=>{
  loadStats()
  fetchRevenue()
  fetchBreeds()
},[])

  const cards = [
    {
      title: "Users",
      value: stats.users,
      icon: Users,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Caregivers",
      value: stats.caregivers,
      icon: PawPrint,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: ClipboardList,
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Pending Applications",
      value: stats.pending,
      icon: FileClock,
      color: "bg-purple-100 text-purple-600"
    }
  ]
const fetchRevenue = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/revenue`
    )
    setRevenue(res.data)
  } catch {
    toast.error("Failed to load revenue")
  }
}

const fetchBreeds = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/breed-stats`
    )
    setBreeds(res.data)
  } catch {
    toast.error("Failed to load breed stats")
  }
}
  return (
    <div className="space-y-10">

      <h1 className="text-4xl font-extrabold">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        {cards.map((card, index) => {
          const Icon = card.icon

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition flex items-center justify-between"
            >
              <div>
                <p className="text-gray-500 text-sm">
                  {card.title}
                </p>

                <p className="text-3xl font-bold mt-1">
                  {card.value}
                </p>
              </div>

              <div className={`p-3 rounded-xl ${card.color}`}>
                <Icon size={22} />
              </div>


            </div>
            
          )
        })}

      </div>

              {revenue && (
  <div className="mt-10">
    
    <h2 className="text-2xl font-bold mb-4">
      Revenue Overview 💰
    </h2>

    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p className="text-gray-500 text-sm">Total Revenue</p>
        <p className="text-2xl font-bold">
          ₹{revenue.totalRevenue}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p className="text-gray-500 text-sm">PawPaw Earnings</p>
        <p className="text-2xl font-bold text-green-600">
          ₹{revenue.platformRevenue}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p className="text-gray-500 text-sm">Caregiver Payout</p>
        <p className="text-2xl font-bold">
          ₹{revenue.caregiverPayout}
        </p>
      </div>

    </div>
 

  </div>
  
)}

   <div className="mt-12">

  <h2 className="text-2xl font-bold mb-4">
    Dog Breed Insights 🐶
  </h2>

  {/* Top 3 highlight cards */}
  <div className="grid md:grid-cols-3 gap-4 mb-6">

    {breeds.slice(0, 3).map((b, i) => (
      <div key={i} className="bg-orange-50 p-4 rounded-xl">

        <p className="text-sm text-gray-500">
          #{i + 1} Most Listed
        </p>

        <p className="text-lg font-bold">
          {b._id || "Unknown"}
        </p>

        <p className="text-orange-600 font-semibold">
          {b.count} dogs
        </p>

      </div>
    ))}

  </div>
  

  {/* Table */}
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

    <table className="w-full">

      <thead className="bg-gray-50 text-left text-sm text-gray-600">
        <tr>
          <th className="p-4">Breed</th>
          <th className="p-4">Total Dogs</th>
        </tr>
      </thead>

      <tbody>
  {breeds.length === 0 ? (
    <tr>
      <td colSpan="2" className="p-4 text-center text-gray-500">
        No breed data available
      </td>
    </tr>
  ) : (
    breeds.map((b, i) => (
      <tr key={i} className="border-t hover:bg-gray-50">
        <td className="p-4 font-medium">
          {b._id || "Unknown"}
        </td>
        <td className="p-4">
          {b.count}
        </td>
      </tr>
    ))
  )}
</tbody>
    </table>

  </div>

</div>
    </div>
    
  )
}