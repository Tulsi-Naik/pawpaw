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
      const petRes = await fetch(`${process.env.REACT_APP_API_URL}/api/pets/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const petData = await petRes.json()
      setPets(petData)


    }

    fetchData()
  }, [token])

  const toggleDay = (day) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(recurringDays.filter(d => d !== day))
    } else {
      setRecurringDays([...recurringDays, day])
    }
  }

  const toggleTimeSlot = (slot) => {
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

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bookings/create`, {
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

    if (res.ok) {
      toast.success("Walk booked successfully 🐾")

      // Reset form
      setSelectedPet(null)
      setTimeSlots([])
      setRecurringDays([])
      setDate("")

      // Redirect
      navigate("/app/my-bookings")
    } else {
      toast.error("Booking failed")
    }
  }
  console.log({
  selectedPet,
  duration,
  timeSlots,
  date,
  packageType,
  recurringDays
})

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

        {/* Multi Time Slot */}
        <div>
          <h2 className="font-semibold mb-4">
            Select Time Slots (You can choose multiple)
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {["6-7 AM", "7-8 AM", "5-6 PM", "6-7 PM"].map(slot => (
              <div
                key={slot}
                onClick={() => toggleTimeSlot(slot)}
                className={`p-4 rounded-xl text-center cursor-pointer transition
                  ${timeSlots.includes(slot)
                    ? "bg-orange-100 border-2 border-orange-500"
                    : "bg-white shadow-sm hover:shadow-md"}
                `}
              >
                {slot}
              </div>
            ))}
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