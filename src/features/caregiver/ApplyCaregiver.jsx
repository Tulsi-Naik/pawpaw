import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"

export default function ApplyCaregiver() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    skills: [],
    experienceYears: "",
    experienceDetails: "",
    availability: [],
    idProofType: "",
    idProofNumber: "",
    referenceName: "",
    referencePhone: "",
    profilePhoto: null,
    idProofImage: null
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePhoto = (e) => {
    setForm({ ...form, profilePhoto: e.target.files[0] })
  }
  const handleIdImage = (e) => {
  setForm({ ...form, idProofImage: e.target.files[0] })
}

  const toggleSkill = (skill) => {
    setForm({
      ...form,
      skills: form.skills.includes(skill)
        ? form.skills.filter(s => s !== skill)
        : [...form.skills, skill]
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.phone || !form.city) {
      toast.error("Fill all required fields")
      return
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error("Enter valid 10 digit phone number")
      return
    }

    if (form.skills.length === 0) {
      toast.error("Select at least one skill")
      return
    }

    if (form.availability.length === 0) {
      toast.error("Select availability")
      return
    }

  if (!form.idProofType || !form.idProofNumber || !form.idProofImage) {
  toast.error("ID proof details required")
  return
}

    try {

      const formData = new FormData()

      Object.keys(form).forEach(key => {
        if (key === "skills" || key === "availability") {
          formData.append(key, JSON.stringify(form[key]))
        } else {
          formData.append(key, form[key])
        }
      })

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/applications/apply`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      toast.success("Application submitted 🐾")

      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        skills: [],
        experienceYears: "",
        experienceDetails: "",
        availability: [],
        idProofType: "",
        idProofNumber: "",
        referenceName: "",
        referencePhone: "",
        profilePhoto: null,
        idProofImage: null,
        otherIdProof: ""
      })

    } catch {
      toast.error("Submission failed")
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">

      <h1 className="text-3xl font-bold mb-8 text-center">
        Apply as Caregiver 🐾
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="font-semibold">Full Name<span className="text-red-500">*</span></label>
          <input
            name="name"
            required
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="font-semibold">Email<span className="text-red-500">*</span></label>
          <input
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="font-semibold">Phone<span className="text-red-500">*</span></label>
          <input
            name="phone"
            required
            placeholder="10 digit phone number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="font-semibold">City<span className="text-red-500">*</span></label>
          <input
            name="city"
            required
            placeholder="City you will work in"
            value={form.city}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* Skills */}
        <div>
          <p className="font-semibold mb-2">Skills</p>

          <div className="flex gap-3">
            {["walking","grooming"].map(skill => (
              <div
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-2 rounded-full cursor-pointer border
                ${form.skills.includes(skill)
                  ? "bg-orange-100 border-orange-500"
                  : "bg-white"}
                `}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

<select
  name="experienceYears"
  required
  value={form.experienceYears}
  onChange={handleChange}
  className="w-full border p-3 rounded-lg"
>
  <option value="">Select experience</option>
  <option value="0">0 years</option>
  <option value="1">1 year</option>
  <option value="2">2 years</option>
  <option value="3">3 years</option>
  <option value="4">4 years</option>
  <option value="5">5+ years</option>
</select>

        <div>
          <label className="font-semibold">Experience Details</label>
          <textarea
            name="experienceDetails"
            placeholder="Briefly describe your pet care experience"
            value={form.experienceDetails}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* Availability */}
        <div>
          <p className="font-semibold mb-2">Availability</p>

          <div className="flex gap-3">
            {["morning","afternoon","evening"].map(slot => (
              <div
                key={slot}
                onClick={() => toggleAvailability(slot)}
                className={`px-4 py-2 rounded-full cursor-pointer border
                ${form.availability.includes(slot)
                  ? "bg-orange-100 border-orange-500"
                  : "bg-white"}
                `}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="font-semibold">ID Proof<span className="text-red-500">*</span></label>
          <select
            name="idProofType"
            required
            value={form.idProofType}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Select ID Proof</option>
            <option value="aadhar">Aadhar</option>
            <option value="driving_license">Driving License</option>
            <option value="pan">PAN</option>
            <option value="other">Other</option>
          </select>
        </div>

        {form.idProofType === "other" && (
  <input
    name="otherIdProof"
    placeholder="Enter ID type"
    value={form.otherIdProof}
    onChange={handleChange}
    className="w-full border p-3 rounded-lg mt-3"
  />
)}

        <div>
  <label className="font-semibold">
    ID Proof Image <span className="text-red-500">*</span>
  </label>

  <input
    type="file"
    accept="image/*"
    required
    onChange={handleIdImage}
    className="w-full border p-3 rounded-lg"
  />
</div>

        <div>
          <label className="font-semibold">ID Proof Number<span className="text-red-500">*</span></label>
          <input
            name="idProofNumber"
            required
            placeholder="Enter ID number"
            value={form.idProofNumber}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* Reference */}
        <div>
          <label className="font-semibold">Reference Name</label>
          <input
            name="referenceName"
            placeholder="Someone who can confirm your work (client/employer)"
            value={form.referenceName}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label className="font-semibold">Reference Phone</label>
          <input
            name="referencePhone"
            placeholder="Phone number of the reference person"
            value={form.referencePhone}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="font-semibold">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600"
        >
          Submit Application
        </button>

      </form>
    </div>
  )
}