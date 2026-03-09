import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { Menu, X, Search } from "lucide-react"

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user"))
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const navItems = [
    { name: "Dashboard", path: "/app/dashboard" },
    { name: "My Pets", path: "/app/pets" },
    { name: "Dog Walking", path: "/app/book" },
      { name: "Grooming", path: "/app/grooming" },   

    { name: "My Bookings", path: "/app/my-bookings" },
    { name: "Profile", path: "/app/profile" }
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r
          flex flex-col
          transform ${open ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <div className="text-xl font-extrabold">
            Paw<span className="text-orange-500">Paw</span>
          </div>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 rounded-lg transition
                ${location.pathname === item.path
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-500 font-medium hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
<div className="h-16 flex items-center gap-4 bg-white border-b px-4 md:px-6">
          {/* Left */}
          <button
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>

          {/* Global Search */}
<div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-md mx-4">            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search services..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          {/* Profile */}
<div className="ml-auto relative">            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold cursor-pointer"
            >
              {user?.name?.charAt(0)}
            </div>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-lg py-2">
                <button
                  onClick={() => navigate("/app/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>
    </div>
  )
}