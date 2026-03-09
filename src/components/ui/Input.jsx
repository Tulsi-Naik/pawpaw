import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function Input({
  type = "text",
  name,
  placeholder,
  onChange,
  required = true
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === "password"

  return (
    <div className="relative">
      <input
        type={isPassword ? (show ? "text" : "password") : type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        className="w-full p-4 pr-12 rounded-2xl border border-gray-200 bg-gray-50
        focus:bg-white focus:border-orange-400 focus:ring-2
        focus:ring-orange-200 outline-none transition-all duration-200"
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  )
}