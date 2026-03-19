import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Input from "../components/ui/Input"
export default function SetPassword() {

  const user = JSON.parse(localStorage.getItem("user"))
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
      `${import.meta.env.VITE_API_URL}/api/auth/set-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          newPassword: password
        })
      }
    )

   if (res.ok) {

  toast.success("Password updated")

  const updatedUser = {
    ...user,
    mustChangePassword: false
  }

  localStorage.setItem("user", JSON.stringify(updatedUser))

  navigate("/caregiver/schedule")

} else {
  toast.error("Error updating password")
}
  }

  return (
    <div className="max-w-md mx-auto py-20">

      <h1 className="text-2xl font-bold mb-6">
        Set New Password
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

       <div className="relative">
<Input
  name="password"
  type="password"
  placeholder="New Password"
  value={password}
  onChange={(e)=>setPassword(e.target.value)}
/>
</div>

       <div className="relative">
<Input
  name="confirm"
  type="password"
  placeholder="Confirm Password"
  value={confirm}
  onChange={(e)=>setConfirm(e.target.value)}
/>
</div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-3 rounded"
        >
          Save Password
        </button>

      </form>

    </div>
  )
}