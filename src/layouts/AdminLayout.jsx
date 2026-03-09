import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"

export default function AdminLayout() {

  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-6">

        <h2 className="text-xl font-bold">
          Paw<span className="text-orange-500">Paw</span> 
        </h2>

        <nav className="space-y-2">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/applications"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            Applications
          </NavLink>

          <NavLink
            to="/admin/caregivers"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            Caregivers
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            Bookings
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            Users
          </NavLink>

        </nav>

      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="h-16 bg-white border-b flex items-center justify-between px-8">

          <h1 className="text-lg font-semibold">
            Admin Panel
          </h1>

          <div className="relative">

            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold cursor-pointer"
            >
              {user?.name?.charAt(0)}
            </div>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-white rounded-xl shadow-lg py-2">

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
        <div className="p-8">
          <Outlet />
        </div>

      </div>

    </div>
  )
}