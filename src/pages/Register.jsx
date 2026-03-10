import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import toast from "react-hot-toast"
export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
toast.error("Passwords do not match")
  return
}

    const res = await fetch(`${process.env.VITE_API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (res.ok) {
  toast.success("Registration successful ")
      navigate("/login")
    } else {
toast.error(data.message || "Registration failed")
    }
  }

  return (
    <section className="min-h-screen bg-linear-to-b from-yellow-50 to-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">

        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Create Account 🐾
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input name="name" placeholder="Full Name" onChange={handleChange} />
          <Input name="email" type="email" placeholder="Email" onChange={handleChange} />
          <Input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <Input
  name="confirmPassword"
  type="password"
  placeholder="Confirm Password"
  onChange={handleChange}
/>
          <Button type="submit">Register</Button>
        </form>
      <p className="text-center text-sm text-gray-600 mt-6">
  Already have an account?{" "}
  <span
    onClick={() => navigate("/login")}
    className="text-orange-500 font-semibold cursor-pointer"
  >
    Login
  </span>
</p>
      </div>
    </section>
  )
}