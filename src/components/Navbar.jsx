import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const handleAuthClick = () => {
    if (user) navigate("/app/dashboard")
    else navigate("/register")
  }

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-gray-900">Paw</span>
          <span className="text-orange-500">Paw</span>
        </Link>

        {/* Navigation */}
        <div className="flex gap-8 items-center text-gray-700 font-medium">

         <Link to="/services" className="hover:text-orange-500 transition">
  Services
</Link>

          <Link to="/about" className="hover:text-orange-500 transition">
            About
          </Link>

         <Link to="/contact" className="hover:text-orange-500 transition">
  Contact
</Link>

          {!user ? (
            <>
              <Link to="/login" className="hover:text-orange-500 transition">
                Login
              </Link>

              <button
                onClick={handleAuthClick}
                className="bg-orange-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition"
              >
                Create Account
              </button>
            </>
          ) : (
            <button
              onClick={handleAuthClick}
              className="bg-orange-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition"
            >
              Dashboard
            </button>
          )}
        </div>

      </div>
    </nav>
  )
}