import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function PetProfilePage() {

  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [pet, setPet] = useState(null)

  useEffect(() => {

    fetch("${process.env.REACT_APP_API_URL}/api/pets/my", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p._id === id)
        setPet(found)
      })

  }, [id, token])

  if (!pet) return <div className="p-10">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* DOG HEADER */}

      <div className="bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-2">
          {pet.name} 🐾
        </h1>

        <p className="text-gray-500">
          {pet.breed}
        </p>

        <button
          onClick={() =>
            navigate("/app/pets", { state: { editPet: pet } })
          }
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Edit Dog
        </button>

      </div>

      {/* PERSONALITY */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-4">
          Personality
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <div>
            ⚡ Energy: {pet.energyLevel ?? 3}/5
          </div>

          <div>
            😊 Friendly: {pet.friendliness ?? 3}/5
          </div>

          <div>
            😟 Anxiety: {pet.anxietyLevel ?? 2}/5
          </div>

          <div>
            🚶 Walk Speed: {pet.walkSpeed ?? 3}/5
          </div>

        </div>

      </div>

      {/* FEARS */}

      {pet.fears?.length > 0 && (

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            Fears
          </h2>

          <div className="flex gap-2 flex-wrap">

            {pet.fears.map(fear => (

              <div
                key={fear}
                className="bg-orange-100 px-3 py-1 rounded-full text-sm"
              >
                {fear}
              </div>

            ))}

          </div>

        </div>

      )}

      {/* HEALTH NOTES */}

      {(pet.allergies || pet.medicalNotes) && (

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            Health Notes
          </h2>

          {pet.allergies && (
            <p>⚠ Allergies: {pet.allergies}</p>
          )}

          {pet.medicalNotes && (
            <p>🩺 Notes: {pet.medicalNotes}</p>
          )}

        </div>

      )}

      {/* FAVORITE TREAT */}

      {pet.favoriteTreat && (

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-2">
            Favorite Treat
          </h2>

          <p>🍪 {pet.favoriteTreat}</p>

        </div>

      )}

    </div>
  )
}