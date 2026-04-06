import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function CreateListing() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  const [pets, setPets] = useState([])
  const [selectedPet, setSelectedPet] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/pets/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPets(data)
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedPet) {
      toast.error("Select a pet")
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/adoption/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          petId: selectedPet,
          description
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Listed for adoption 🐶")
        navigate("/app/adopt")
      } else {
        toast.error(data.message || "Failed")
      }

    } catch {
      toast.error("Error creating listing")
    }
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <div className="max-w-3xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        🐶 Give your dog a new home
      </h1>

      {pets.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-500 mb-4">
            You don’t have any pets yet
          </p>

          <button
            onClick={() => navigate("/app/pets")}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Add Pet
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Select Pet */}
          <div>
            <p className="font-semibold mb-2">Select Pet</p>

            <div className="grid md:grid-cols-3 gap-4">
              {pets.map(pet => (
                <div
                  key={pet._id}
                  onClick={() => setSelectedPet(pet._id)}
                  className={`p-4 rounded-xl cursor-pointer border
                    ${selectedPet === pet._id
                      ? "border-orange-500 bg-orange-50"
                      : "bg-white"}
                  `}
                >
                  <p className="font-semibold">{pet.name}</p>
                  <p className="text-sm text-gray-500">
                    {pet.breed || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="font-semibold mb-2">
              About your dog
            </p>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Personality, behavior, reason for adoption..."
              className="w-full border rounded-xl p-3 h-32"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl"
          >
            Post for Adoption
          </button>

        </form>
      )}

    </div>
  )
}