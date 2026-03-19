import { useState } from "react"
import toast from "react-hot-toast"

export default function ForgotPassword() {

  const [email, setEmail] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }
    )

    const data = await res.json()

    if (res.ok) {
      toast.success("Reset link sent to email")
    } else {
      toast.error(data.message)
    }
  }

  return (
    <div className="max-w-md mx-auto py-20">

      <h1 className="text-2xl font-bold mb-6">
        Forgot Password
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-3 rounded"
        >
          Send Reset Link
        </button>

      </form>

    </div>
  )
}