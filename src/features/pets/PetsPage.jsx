import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useLocation } from "react-router-dom"

export default function PetsPage() {

  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const location = useLocation()

  const [pets, setPets] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingPet, setEditingPet] = useState(null)

  const emptyForm = {
    name: "",
    type: "Dog",
    breed: "",
    energyLevel: 3,
    friendliness: 3,
    anxietyLevel: 2,
    walkSpeed: 3,
    allergies: "",
    medicalNotes: "",
    fears: [],
    favoriteTreat: ""
  }

  const [form, setForm] = useState(emptyForm)

  const energyEmoji = ["😴","😌","🙂","😃","🚀"]
  const friendlyEmoji = ["😡","😐","🙂","😄","❤️"]
  const anxietyEmoji = ["😌","🙂","😟","😰","😱"]
  const speedEmoji = ["🐢","🚶","🏃","💨","⚡"]

  useEffect(() => {
    fetch(`${process.env.VITE_API_URL}/api/pets/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPets(data))
  }, [token])

  // ⭐ Handle edit when coming from profile page
useEffect(() => {
  if (location.state?.editPet && !showForm) {
    startEdit(location.state.editPet)
  }
}, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    let res

    if (editingPet) {
      res = await fetch(`${process.env.VITE_API_URL}/api/pets/${editingPet}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
    } else {
      res = await fetch(`${process.env.VITE_API_URL}/api/pets/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
    }

if (res.ok) {
  toast.success(editingPet ? "Dog updated 🐶" : "Dog added 🐶")

  setShowForm(false)
  setEditingPet(null)
  setForm(emptyForm)

  const data = await fetch(`${process.env.VITE_API_URL}/api/pets/my`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json())

  setPets(data)
}else {
      toast.error("Error saving dog")
    }
  }

  const toggleFear = (fear) => {
    if (form.fears.includes(fear)) {
      setForm({
        ...form,
        fears: form.fears.filter(f => f !== fear)
      })
    } else {
      setForm({
        ...form,
        fears: [...form.fears, fear]
      })
    }
  }

  const startEdit = (pet) => {
    setEditingPet(pet._id)

    setForm({
      name: pet.name || "",
      type: pet.type || "Dog",
      breed: pet.breed || "",
      energyLevel: pet.energyLevel ?? 3,
      friendliness: pet.friendliness ?? 3,
      anxietyLevel: pet.anxietyLevel ?? 2,
      walkSpeed: pet.walkSpeed ?? 3,
      allergies: pet.allergies || "",
      medicalNotes: pet.medicalNotes || "",
      fears: pet.fears || [],
      favoriteTreat: pet.favoriteTreat || ""
    })

    setShowForm(true)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Dogs 🐾</h1>

        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingPet(null)
            setForm(emptyForm)
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          + Add Dog
        </button>
      </div>

      {/* FORM */}

      {showForm && (

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">

          <input
            placeholder="Dog Name"
            value={form.name}
            className="w-full border p-3 rounded"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Breed"
            value={form.breed}
            className="w-full border p-3 rounded"
            onChange={e => setForm({ ...form, breed: e.target.value })}
          />

          {/* ENERGY */}

          <div>
            <p className="font-semibold mb-2">Energy Level</p>
            <div className="text-3xl mb-2">{energyEmoji[form.energyLevel-1]}</div>

            <input
              type="range"
              min="1"
              max="5"
              value={form.energyLevel}
              className="w-full accent-orange-500"
              onChange={e =>
                setForm({ ...form, energyLevel: Number(e.target.value) })
              }
            />

            <div className="flex justify-between text-xl mt-2">
              {energyEmoji.map(e => <span key={e}>{e}</span>)}
            </div>
          </div>

          {/* FRIENDLINESS */}

          <div>
            <p className="font-semibold mb-2">Friendliness</p>
            <div className="text-3xl mb-2">{friendlyEmoji[form.friendliness-1]}</div>

            <input
              type="range"
              min="1"
              max="5"
              value={form.friendliness}
              className="w-full accent-orange-500"
              onChange={e =>
                setForm({ ...form, friendliness: Number(e.target.value) })
              }
            />

            <div className="flex justify-between text-xl mt-2">
              {friendlyEmoji.map(e => <span key={e}>{e}</span>)}
            </div>
          </div>

          <div>
  <p className="font-semibold mb-2">Anxiety Level</p>

  <div className="text-3xl mb-2">
    {anxietyEmoji[form.anxietyLevel-1]}
  </div>

  <input
    type="range"
    min="1"
    max="5"
    value={form.anxietyLevel}
    className="w-full accent-orange-500"
    onChange={e =>
      setForm({ ...form, anxietyLevel: Number(e.target.value) })
    }
  />

  <div className="flex justify-between text-xl mt-2">
    {anxietyEmoji.map(e => <span key={e}>{e}</span>)}
  </div>
</div>

<div>
  <p className="font-semibold mb-2">Walk Speed</p>

  <div className="text-3xl mb-2">
    {speedEmoji[form.walkSpeed-1]}
  </div>

  <input
    type="range"
    min="1"
    max="5"
    value={form.walkSpeed}
    className="w-full accent-orange-500"
    onChange={e =>
      setForm({ ...form, walkSpeed: Number(e.target.value) })
    }
  />

  <div className="flex justify-between text-xl mt-2">
    {speedEmoji.map(e => <span key={e}>{e}</span>)}
  </div>
</div>

          {/* FEARS */}

          <div>
            <p className="font-semibold">Fears</p>

            <div className="flex gap-3 flex-wrap mt-2">
              {["Thunder","Bikes","Strangers","Other Dogs"].map(fear => (
                <div
                  key={fear}
                  onClick={() => toggleFear(fear)}
                  className={`px-3 py-1 rounded-full border cursor-pointer
                  ${form.fears.includes(fear)
                    ? "bg-orange-100 border-orange-500"
                    : ""}`}
                >
                  {fear}
                </div>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Allergies"
            value={form.allergies}
            className="w-full border p-3 rounded"
            onChange={e => setForm({ ...form, allergies: e.target.value })}
          />

          <textarea
            placeholder="Medical Notes"
            value={form.medicalNotes}
            className="w-full border p-3 rounded"
            onChange={e => setForm({ ...form, medicalNotes: e.target.value })}
          />

          <input
            placeholder="Favorite Treat"
            value={form.favoriteTreat}
            className="w-full border p-3 rounded"
            onChange={e => setForm({ ...form, favoriteTreat: e.target.value })}
          />

       <div className="flex gap-3">

  <button
    type="submit"
    className="bg-orange-500 text-white px-6 py-3 rounded-lg"
  >
    {editingPet ? "Update Dog" : "Save Dog"}
  </button>

  <button
    type="button"
    onClick={() => {
      setShowForm(false)
      setEditingPet(null)
      setForm(emptyForm)
    }}
    className="px-6 py-3 border rounded-lg"
  >
    Cancel
  </button>

</div>

        </form>

      )}

      {/* DOG CARDS */}

{!showForm && (

<div className="grid md:grid-cols-2 gap-6">

  {pets.map(pet => (

    <div
      key={pet._id}
      className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
    >

      <div
        onClick={() => navigate(`/app/pets/${pet._id}`)}
        className="cursor-pointer"
      >
        <h3 className="font-bold text-xl">{pet.name}</h3>
        <p className="text-gray-500">{pet.breed}</p>

        <p className="mt-2 text-sm">
          ⚡ Energy: {pet.energyLevel ?? 3}/5
        </p>

        <p className="text-sm">
          😊 Friendly: {pet.friendliness ?? 3}/5
        </p>

        <p className="text-sm">
          😟 Anxiety: {pet.anxietyLevel ?? 2}/5
        </p>
      </div>

      <button
        onClick={() => startEdit(pet)}
        className="mt-3 text-sm text-orange-600 font-semibold"
      >
        Edit
      </button>

    </div>

  ))}

</div>

)}

    </div>
  )
}