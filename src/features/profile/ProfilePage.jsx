import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function ProfilePage() {
  const token = localStorage.getItem("token")

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "", // 🔥 Added for pickup location
    bio: "",
    profilePhoto: null // file OR url
  })

  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [editProfile, setEditProfile] = useState(false)
  const [editingPetId, setEditingPetId] = useState(null)

  // Fetch user + pets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const userData = await userRes.json()

        setForm({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          city: userData.city || "",
          address: userData.address || "", // 🔥 Added
          bio: userData.bio || "",
          profilePhoto: userData.profilePhoto || "" // url initially
        })

        const petsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/my`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const petsData = await petsRes.json()
        setPets(petsData)

      } catch {
        toast.error("Error loading profile")
      }

      setLoading(false)
    }

    fetchData()
  }, [token])

  // 🔥 SAVE PROFILE
  const handleUserSave = async () => {
    try {
      const formData = new FormData()

      formData.append("phone", form.phone)
      formData.append("city", form.city)
      formData.append("address", form.address) // 🔥 Added to FormData
      formData.append("bio", form.bio)

      // only append if file selected
      if (form.profilePhoto && typeof form.profilePhoto !== "string") {
        formData.append("profilePhoto", form.profilePhoto)
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      const updatedUser = await res.json()

      localStorage.setItem("user", JSON.stringify(updatedUser))

      setForm(prev => ({
        ...prev,
        profilePhoto: updatedUser.profilePhoto,
        address: updatedUser.address // 🔥 Sync updated address
      }))

      toast.success("Profile updated")

    } catch {
      toast.error("Error updating profile")
    }
  }

  // Update pet
  const handlePetUpdate = async (pet) => {
    try {
      const formData = new FormData()

      Object.keys(pet).forEach(key => {
        if (key === "fears") {
          formData.append(key, JSON.stringify(pet[key]))
        } else {
          formData.append(key, pet[key])
        }
      })

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/${pet._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      const updatedPet = await res.json()

      setPets(prev =>
        prev.map(p => p._id === pet._id ? updatedPet : p)
      )

      setEditingPetId(null)
      toast.success("Dog updated")

    } catch {
      toast.error("Error updating dog")
    }
  }

  const handlePetDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/pets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      setPets(pets.filter(p => p._id !== id))
      toast.success("Dog removed")

    } catch {
      toast.error("Error deleting dog")
    }
  }

  const handleAddPet = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: "New Dog",
          type: "Dog",
          breed: "",
          age: ""
        })
      })

      const data = await res.json()
      setPets([...pets, data.pet])
      toast.success("Dog added")

    } catch {
      toast.error("Error adding dog")
    }
  }

  if (loading) return <div className="p-10">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 space-y-12">

      {/* PERSONAL INFO */}
      <div className="bg-linear-to-br from-orange-50 to-white p-8 rounded-3xl shadow-lg">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">👤 Personal Information</h2>

          {!editProfile ? (
            <button onClick={() => setEditProfile(true)} className="text-orange-500 font-semibold">
              Edit
            </button>
          ) : (
            <button onClick={() => setEditProfile(false)} className="text-gray-500">
              Cancel
            </button>
          )}
        </div>

        {!editProfile ? (
          <div className="space-y-4">

            <div className="flex justify-center mb-6">
              <img
                src={form.profilePhoto || "/default-avatar.png"}
                className="w-24 h-24 rounded-full object-cover border"
              />
            </div>

            <div className="bg-white p-5 rounded-2xl">
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="font-semibold text-lg">{form.name}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl">
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-semibold text-lg">{form.email}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl">
              <p className="text-sm text-gray-400">Phone</p>
              <p className="font-semibold text-lg">{form.phone || "Not added"}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl">
              <p className="text-sm text-gray-400">City</p>
              <p className="font-semibold text-lg">{form.city || "Not added"}</p>
            </div>

            {/* 🔥 Display Address */}
            <div className="bg-white p-5 rounded-2xl">
              <p className="text-sm text-gray-400">Full Pickup Address</p>
              <p className="font-semibold text-lg">{form.address || "Not added"}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl">
              <p className="text-sm text-gray-400">About Me</p>
              <p className="font-semibold text-lg">{form.bio || "Not added"}</p>
            </div>

          </div>
        ) : (
          <div className="space-y-5">

            <div className="flex justify-center">
              <img
                src={
                  form.profilePhoto instanceof File
                    ? URL.createObjectURL(form.profilePhoto)
                    : form.profilePhoto || "/default-avatar.png"
                }
                className="w-24 h-24 rounded-full object-cover border cursor-pointer"
                onClick={() => document.getElementById("photoInput").click()}
              />
            </div>

            <input
              id="photoInput"
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, profilePhoto: e.target.files[0] })
              }
            />

            <input value={form.name} disabled className="w-full p-4 border rounded-xl bg-gray-100" />
            <input value={form.email} disabled className="w-full p-4 border rounded-xl bg-gray-100" />

            <input
              value={form.phone}
              placeholder="Phone Number"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-4 border rounded-xl"
            />

            <input
              value={form.city}
              placeholder="City"
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full p-4 border rounded-xl"
            />

            {/* 🔥 Address Input */}
            <textarea
              value={form.address}
              placeholder="Full Pickup Address (Building, Street, Landmark)"
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-4 border rounded-xl h-24"
            />

            <textarea
              value={form.bio}
              placeholder="About Me"
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full p-4 border rounded-xl"
            />

            <button
              onClick={() => {
                handleUserSave()
                setEditProfile(false)
              }}
              className="bg-orange-500 text-white px-6 py-3 rounded-full"
            >
              Save Changes
            </button>

          </div>
        )}
      </div>

      {/* DOGS SECTION */}
      <div className="bg-linear-to-br from-orange-50 to-white p-8 rounded-3xl shadow-lg space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🐶 Your Dogs
          </h2>

          <button
            onClick={handleAddPet}
            className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-semibold hover:bg-orange-200 transition"
          >
            + Add Dog
          </button>
        </div>

        {pets.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No dogs yet. Let’s add one 🐾
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition relative"
            >
              {editingPetId === pet._id ? (
                <>
                  <input
                    value={pet.name}
                    onChange={(e) =>
                      setPets(pets.map(p =>
                        p._id === pet._id ? { ...p, name: e.target.value } : p
                      ))
                    }
                    className="w-full p-3 border rounded-xl mb-3"
                  />

                  <input
                    value={pet.breed || ""}
                    onChange={(e) =>
                      setPets(pets.map(p =>
                        p._id === pet._id ? { ...p, breed: e.target.value } : p
                      ))
                    }
                    placeholder="Breed"
                    className="w-full p-3 border rounded-xl mb-4"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => handlePetUpdate(pet)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-full"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingPetId(null)}
                      className="text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">
                        {pet.name || "Unnamed Dog"}
                      </h3>
                      <p className="text-gray-500">
                        {pet.breed || "Breed not added"}
                      </p>
                    </div>

                    <div className="flex gap-3 text-sm">
                      <button
                        onClick={() => setEditingPetId(pet._id)}
                        className="text-orange-500 font-medium"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handlePetDelete(pet._id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}