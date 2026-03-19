import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Input from "../components/ui/Input"

export default function ResetPassword() {

  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirm) {
      toast.error("Passwords do not match")
      return
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password })
      }
    )

    const data = await res.json()

    if (res.ok) {
      toast.success("Password reset successful")
      navigate("/login")
    } else {
      toast.error(data.message)
    }
  }

  return (
    <div className="max-w-md mx-auto py-20">

      <h1 className="text-2xl font-bold mb-6">
        Reset Password
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <Input
          name="password"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <Input
          name="confirm"
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e)=>setConfirm(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-3 rounded"
        >
          Reset Password
        </button>

      </form>

    </div>
  )
}