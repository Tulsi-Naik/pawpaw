import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import toast from "react-hot-toast"
export default function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch("${process.env.REACT_APP_API_URL}/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (res.ok) {
  localStorage.setItem("token", data.token)
  localStorage.setItem("user", JSON.stringify(data.user))

if (data.user.role === "caregiver") {
  toast.success("Login successful ")

  if (data.user.onboardingStatus === "pending_setup") {
    navigate("/caregiver/profile-setup")
  } else {
    navigate("/caregiver/schedule")
  }
} else if (data.user.role === "admin") {
    toast.success("Login successful ")

navigate("/admin/dashboard")
} else {
    toast.success("Login successful ")

  navigate("/app/dashboard")
}
} else {
toast.error(data.message || "Login failed")
    }
  }

  return (
    <section className="min-h-screen bg-linear-to-b from-yellow-50 to-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">

        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Welcome Back 🐶
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input name="email" type="email" placeholder="Email" onChange={handleChange} />
          <Input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <Button type="submit">Login</Button>
        </form>
<p className="text-center text-sm text-gray-600 mt-6">
  Don’t have an account?{" "}
  <span
    onClick={() => navigate("/register")}
    className="text-orange-500 font-semibold cursor-pointer"
  >
    Create one
  </span>
</p>
      </div>
      
    </section>
    
  )
}