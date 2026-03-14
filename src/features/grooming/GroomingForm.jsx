import { bookGrooming } from "./groomingApi"
import toast from "react-hot-toast"
import { useState, useEffect } from "react"
import axios from "axios"

export default function GroomingForm() {

  const [petId, setPetId] = useState("")
  const [service, setService] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [services, setServices] = useState([])
const [pets, setPets] = useState([])
const token = localStorage.getItem("token")

useEffect(() => {
  const fetchServices = async () => {
const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/services?category=grooming`)
    setServices(Array.isArray(res.data) ? res.data : [])
  }

  fetchServices()
}, [])

useEffect(() => {
  const fetchPets = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/pets/my`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    setPets(res.data)
  }

  fetchPets()
}, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
   await bookGrooming({
  petId,
  serviceId: service,
  date,
  timeSlots: [time],
  duration: services.find(s => s._id === service)?.duration,
  packageType: "one-time",
  finalPrice: services.find(s => s._id === service)?.price
})

toast.success("Grooming request sent")

// clear form
setPetId("")
setService("")
setDate("")
setTime("")
setNotes("")
    } catch {
      toast.error("Booking failed")
    }
  }
const slots = [
  "9–10 AM",
  "10–11 AM",
  "11–12 PM",
  "1–2 PM",
  "2–3 PM",
  "3–4 PM",
  "4–5 PM"
]

const isFormValid =
  petId &&
  service &&
  date &&
  time
  return (
  <form onSubmit={handleSubmit} className="space-y-6">

{/* Select Pet */}
<div>
  <h2 className="font-semibold mb-3">Who needs grooming? 🐶</h2>

<div className="flex gap-4 flex-wrap">
      {pets.map((pet) => (
      <div
        key={pet._id}
        onClick={() => setPetId(pet._id)}
        className={`p-6 rounded-2xl cursor-pointer transition shadow-sm
        ${petId === pet._id
          ? "bg-orange-100 border-2 border-orange-500"
          : "bg-white hover:shadow-md"}
        `}
      >
        <h3 className="font-bold text-lg">{pet.name}</h3>
        <p className="text-sm text-gray-500">
          {pet.breed || "Breed not set"}
        </p>
      </div>
    ))}
  </div>
</div>

{/* Grooming Services */}
<div>
  <h2 className="font-semibold mb-3">Choose Grooming ✂️</h2>

<div className="flex gap-4 flex-wrap">
    {services.map((s) => (
      <div
        key={s._id}
        onClick={() => setService(s._id)}
className={`px-6 py-4 rounded-2xl text-center cursor-pointer transition        ${service === s._id
          ? "bg-orange-500 text-white"
          : "bg-white shadow-sm hover:shadow-md"}
        `}
      >
        <p className="font-bold text-lg">{s.name}</p>
        <p className="text-sm">₹{s.price}</p>
      </div>
    ))}

  </div>
</div>

    {/* Date */}
    <div>
      <label className="font-medium">Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border rounded-lg p-2 mt-1"
        required
      />
    </div>

{/* Time Slots */}
<div>
  <h2 className="font-semibold mb-3">Select Time ⏰</h2>

<div className="grid grid-cols-3 md:grid-cols-4 gap-3">
  {slots.map((slot) => (
    <div
      key={slot}
      onClick={() => setTime(slot)}
      className={`py-3 text-center rounded-full cursor-pointer transition border text-sm
      ${time === slot
        ? "border-orange-500 bg-orange-50"
        : "bg-white hover:shadow"}
      `}
    >
      {slot}
    </div>
  ))}
</div>
</div>
{/* Price Preview */}
{service && (
  <div className="bg-orange-50 p-6 rounded-2xl text-center space-y-2">
    <p className="text-gray-600">Selected Service</p>

    <p className="text-xl font-bold">
      {services.find(s => s._id === service)?.name}
    </p>

    <p className="text-3xl font-extrabold text-orange-600">
      ₹{services.find(s => s._id === service)?.price}
    </p>
  </div>
)}

    {/* Notes */}
    <div>
      <label className="font-medium">Notes (optional)</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border rounded-lg p-2 mt-1"
        rows="3"
      />
    </div>

    {/* Submit */}
    <button
  type="submit"
  disabled={!isFormValid}
  className={`w-full py-3 rounded-xl font-semibold transition
  ${isFormValid
    ? "bg-orange-500 text-white hover:bg-orange-600"
    : "bg-gray-300 text-gray-500 cursor-not-allowed"}
  `}
>
  Book Grooming ✂️
</button>

  </form>
)
}
