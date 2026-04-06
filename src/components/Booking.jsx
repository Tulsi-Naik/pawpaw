import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function Booking() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
 const WALKING_SERVICE_ID = "69a6da9643961d98dec20658"
  const [pets, setPets] = useState([])
  

  const [selectedPet, setSelectedPet] = useState(null)
  const [duration, setDuration] = useState(45)
  const [timeSlots, setTimeSlots] = useState([])
  const [packageType, setPackageType] = useState("one-time")
  const [recurringDays, setRecurringDays] = useState([])
  const [date, setDate] = useState("")
const [slotWarning, setSlotWarning] = useState(null)

  const morningSlots = [
  "5:30 AM","6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM"
]

const eveningSlots = [
  "4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM"
]

  const basePrices = {
    30: 199,
    45: 249,
    60: 299
  }

  const weeks = 4
  const discountMultiplier =
    packageType === "recurring" ? 0.85 : 1

  const discountedPerWalk =
    Math.round(basePrices[duration] * discountMultiplier)

  const slotsPerDay = timeSlots.length
  const walksPerWeek = recurringDays.length * slotsPerDay
  const totalRecurringWalks = weeks * walksPerWeek

  const oneTimeTotal = discountedPerWalk * slotsPerDay
  const totalRecurringPrice =
    discountedPerWalk * totalRecurringWalks

const isFormValid =
  !!selectedPet &&
  timeSlots.length > 0 &&
  !!date &&
  (packageType === "one-time" ||
    (packageType === "recurring" && recurringDays.length > 0))

  // Fetch pets + services
  useEffect(() => {
    const fetchData = async () => {
      const petRes = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const petData = await petRes.json()
      setPets(petData)


    }

    fetchData()
  }, [token])

  useEffect(() => {
  setTimeSlots([])
  setSlotWarning(null)
}, [duration])

  const toggleDay = (day) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter(d => d !== day))
    } else {
      setRecurringDays([...recurringDays, day])
    }
  }

  const convertToMinutes = (time) => {
  const [t, period] = time.split(" ")
  let [hours, minutes] = t.split(":").map(Number)

  if (period === "PM" && hours !== 12) hours += 12
  if (period === "AM" && hours === 12) hours = 0

  return hours * 60 + minutes
}

const toggleTimeSlot = (slot) => {

  setSlotWarning(null)

  // allow deselect first
  if (timeSlots.includes(slot)) {
    setTimeSlots(timeSlots.filter(s => s !== slot))
    return
  }

  const newStart = convertToMinutes(slot)
  const newEnd = newStart + duration

  for (let selected of timeSlots) {

    const selectedStart = convertToMinutes(selected)
    const selectedEnd = selectedStart + duration

    const overlap =
      newStart < selectedEnd && newEnd > selectedStart

   if (overlap) {
  setSlotWarning(slot)
  return
}

  }

  if (timeSlots.includes(slot)) {
    setTimeSlots(timeSlots.filter(s => s !== slot))
  } else {
    setTimeSlots([...timeSlots, slot])
  }

}

const handleSubmit = async (e) => {
  e.preventDefault()

  if (!isFormValid) {
    toast.error("Please complete all required fields")
    return
  }

  try {

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        petId: selectedPet,
        serviceId: WALKING_SERVICE_ID,
        date,
        timeSlots,
        duration,
        packageType,
        recurringDays,
        finalPrice:
          packageType === "one-time"
            ? oneTimeTotal
            : totalRecurringPrice
      })
    })

    const data = await res.json()

    if (res.ok) {

      toast.success("Walk booked successfully 🐾")

      setSelectedPet(null)
      setTimeSlots([])
      setRecurringDays([])
      setDate("")

      navigate("/app/my-bookings")

    } else {

      toast.error(data.message || "Booking failed")

    }

  } catch (err) {

    console.error(err)
    toast.error("Something went wrong")

  }
}
if (pets.length === 0) {
  return (
    <div className="max-w-3xl mx-auto py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">
        No pets added yet 🐶
      </h2>

      <p className="text-gray-600 mb-6">
        Add your dog to start booking walks & grooming
      </p>

      <button
        onClick={() => navigate("/app/pets")}
        className="bg-orange-500 text-white px-6 py-3 rounded-xl"
      >
        Add Pet
      </button>
    </div>
  )
}

  return (
    <div className="max-w-5xl mx-auto py-16 px-6 space-y-12">

      <h1 className="text-4xl font-extrabold text-center">
        Book a Walk 🐕
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* Pet Selection */}
        <div>
          <h2 className="font-semibold mb-4">Select who's going on a walk</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {pets.map(pet => (
              <div
                key={pet._id}
                onClick={() => setSelectedPet(pet._id)}
                className={`p-6 rounded-2xl cursor-pointer transition shadow-sm
                  ${selectedPet === pet._id
                    ? "bg-orange-100 border-2 border-orange-500"
                    : "bg-white hover:shadow-md"}
                `}
              >
                <h3 className="font-bold">{pet.name}</h3>
                <p className="text-sm text-gray-500">
                  {pet.breed || "Breed not set"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <h2 className="font-semibold mb-4">Walk Duration</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[30, 45, 60].map(d => (
              <div
                key={d}
                onClick={() => setDuration(d)}
                className={`p-6 rounded-2xl text-center cursor-pointer transition
                  ${duration === d
                    ? "bg-orange-500 text-white"
                    : "bg-white shadow-sm hover:shadow-md"}
                `}
              >
                <p className="font-bold text-lg">{d} Minutes</p>
                <p className="text-sm">
                  ₹{basePrices[d]}
                </p>
              </div>
            ))}
          </div>
        </div>

{/* Start Time */}
<div>

<h2 className="font-semibold mb-2">
Select Walk Start Time
</h2>

<p className="text-sm text-gray-500 mb-4">
Duration: {duration} minutes
</p>

{/* MORNING */}
<div className="mb-6">

<p className="text-sm font-semibold text-gray-600 mb-3">
🌅 Morning Walks
</p>

<div className="flex flex-wrap gap-3">

{morningSlots.map(slot => (

<button
type="button"
key={slot}
onClick={() => toggleTimeSlot(slot)}
className={`px-4 py-2 rounded-full text-sm font-medium transition
${timeSlots.includes(slot)
? "bg-orange-500 text-white shadow"
: "bg-gray-100 hover:bg-orange-100"}
`}
>
{slot}
{slotWarning === slot && (
  <p className="text-red-500 text-xs mt-1">
    ⚠ Overlaps with another selected walk
  </p>
)}
</button>

))}

</div>

</div>

{/* EVENING */}
<div>

<p className="text-sm font-semibold text-gray-600 mb-3">
🌇 Evening Walks
</p>

<div className="flex flex-wrap gap-3">

{eveningSlots.map(slot => (
<button
type="button"
key={slot}
onClick={() => toggleTimeSlot(slot)}
className={`px-4 py-2 rounded-full text-sm font-medium transition
${timeSlots.includes(slot)
? "bg-orange-500 text-white shadow"
: "bg-gray-100 hover:bg-orange-100"}
`}
>
{slot}

{slotWarning === slot && (
  <p className="text-red-500 text-xs mt-1">
    ⚠ Overlaps with another selected walk
  </p>
)}

</button>

))}

</div>

</div>

</div>

        {/* Date */}
        <div>
          <h2 className="font-semibold mb-2">Select Start Date</h2>
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            className="p-4 border rounded-xl w-full"
          />
        </div>

        {/* Package */}
        <div>
          <h2 className="font-semibold mb-4">Package Type</h2>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setPackageType("one-time")}
              className={`px-6 py-3 rounded-full
                ${packageType === "one-time"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200"}
              `}
            >
              One-Time
            </button>

            <button
              type="button"
              onClick={() => setPackageType("recurring")}
              className={`px-6 py-3 rounded-full
                ${packageType === "recurring"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200"}
              `}
            >
              Recurring (4 Weeks - 15% Off)
            </button>
          </div>

          {packageType === "recurring" && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-full cursor-pointer
                    ${recurringDays.includes(day)
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200"}
                  `}
                >
                  {day}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="bg-orange-50 p-6 rounded-2xl text-center space-y-2">
          {packageType === "one-time" ? (
            <>
              <p className="text-gray-600">
                ₹{discountedPerWalk} × {slotsPerDay} slot(s)
              </p>
              <p className="text-3xl font-extrabold text-orange-600">
                ₹{oneTimeTotal || 0}
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                ₹{discountedPerWalk} per walk × {totalRecurringWalks} walks
              </p>
              <p className="text-3xl font-extrabold text-orange-600">
                ₹{totalRecurringPrice || 0}
              </p>
              <p className="text-sm text-gray-500">
                Covers 4 weeks • 15% recurring discount applied
              </p>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-4 rounded-2xl font-bold transition
            ${isFormValid
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"}
          `}
        >
          Confirm Booking 🐾
        </button>

      </form>
    </div>
  )
}