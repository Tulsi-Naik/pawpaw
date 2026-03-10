import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function CaregiverProfile() {

  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [editing, setEditing] = useState(user?.onboardingStatus === "pending_setup")

  const [form, setForm] = useState({
    bio: user?.bio || "",
    serviceRadius: user?.serviceRadius || "",
    dogSizesHandled: user?.dogSizesHandled || [],
    availability: user?.availability || [],
    phone: user?.phone || "",
    city: user?.city || "",
    profilePhoto: null
  })

  const toggleSize = (size) => {
    setForm({
      ...form,
      dogSizesHandled: form.dogSizesHandled.includes(size)
        ? form.dogSizesHandled.filter(s => s !== size)
        : [...form.dogSizesHandled, size]
    })
  }

  const toggleAvailability = (slot) => {
    setForm({
      ...form,
      availability: form.availability.includes(slot)
        ? form.availability.filter(a => a !== slot)
        : [...form.availability, slot]
    })
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

const handleSubmit = async (e) => {
  e.preventDefault()

  try {

    const formData = new FormData()

    formData.append("bio", form.bio)
    formData.append("serviceRadius", form.serviceRadius)
    formData.append("phone", form.phone)
    formData.append("city", form.city)
    formData.append("dogSizesHandled", JSON.stringify(form.dogSizesHandled))
    formData.append("availability", JSON.stringify(form.availability))

    if (form.profilePhoto) {
      formData.append("profilePhoto", form.profilePhoto)
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/caregivers/setup-profile`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    )

    if (res.ok) {
      const data = await res.json()

      localStorage.setItem("user", JSON.stringify(data.caregiver))

      toast.success("Profile updated 🐾")
      setEditing(false)

    } else {
      toast.error("Failed to save profile")
    }

  } catch {
    toast.error("Error saving profile")
  }
}
  if (!editing) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-6">

        <div className="bg-white shadow-lg rounded-3xl p-10">

          <div className="flex items-center gap-6 mb-8">

            <div className="w-20 h-20 relative">
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-orange-500 text-white flex items-center justify-center text-3xl font-bold">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.city}</p>
              <p className="text-gray-500">{user.phone}</p>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-8">

            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex gap-2 flex-wrap">
                {user.skills?.map(s => (
                  <span key={s} className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Availability</h3>
              <div className="flex gap-2 flex-wrap">
                {user.availability?.map(a => (
                  <span key={a} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Dog Sizes</h3>
              <div className="flex gap-2 flex-wrap">
                {user.dogSizesHandled?.map(s => (
                  <span key={s} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Service Radius</h3>
              <p>{user.serviceRadius || "Not set"} km</p>
            </div>

          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-gray-600">{user.bio || "No bio added yet."}</p>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="mt-8 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600"
          >
            Edit Profile
          </button>

        </div>

      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">

      <h1 className="text-3xl font-bold mb-8">
        Edit Profile 🐾
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="font-semibold">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, profilePhoto: e.target.files[0] })}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="font-semibold">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="font-semibold">City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="font-semibold">About You</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="font-semibold">Service Radius (km)</label>
          <input
            name="serviceRadius"
            type="number"
            value={form.serviceRadius}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <p className="font-semibold mb-2">Dog Sizes You Handle</p>
          <div className="flex gap-3">
            {["small","medium","large"].map(size => (
              <div
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 rounded-full border cursor-pointer
                ${form.dogSizesHandled.includes(size)
                  ? "bg-orange-100 border-orange-500"
                  : "bg-white"}`}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Availability</p>
          <div className="flex gap-3">
            {["morning","afternoon","evening"].map(slot => (
              <div
                key={slot}
                onClick={() => toggleAvailability(slot)}
                className={`px-4 py-2 rounded-full border cursor-pointer
                ${form.availability.includes(slot)
                  ? "bg-orange-100 border-orange-500"
                  : "bg-white"}`}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>

        <button
          className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600"
        >
          Save Profile
        </button>

      </form>

    </div>
  )
}