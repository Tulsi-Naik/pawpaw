import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { Menu, X, Search } from "lucide-react"
import { useState, useEffect } from "react"
export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const [currentUser, setCurrentUser] = useState(
  JSON.parse(localStorage.getItem("user"))
)

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("user")))
  }, 1000)

  return () => clearInterval(interval)
}, [])

  const navItems = [
        { name: "Home", path: "/app/home" },

    { name: "Dashboard", path: "/app/dashboard" },
    { name: "My Pets", path: "/app/pets" },
    { name: "Dog Walking", path: "/app/book" },
      { name: "Grooming", path: "/app/grooming" },   

    { name: "My Bookings", path: "/app/my-bookings" },
    { name: "Profile", path: "/app/profile" }
  ]

  const searchItems = [
    {
      title: "Dog Walking",
      path: "/app/book",
      keywords: ["walk", "walking", "book", "booking", "dog walk", "brooming"]
    },
    {
      title: "Grooming",
      path: "/app/grooming",
      keywords: ["grooming", "groom", "bath", "haircut"]
    },
    {
      title: "Adoption",
      path: "/app/adopt",
      keywords: ["adoption", "adopt", "adopt dog"]
    },
    {
      title: "My Bookings",
      path: "/app/my-bookings",
      keywords: ["my bookings", "bookings", "track", "payment", "history"]
    }
  ]

  const filteredSearchItems = searchItems.filter(item => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return false

    return item.title.toLowerCase().includes(keyword) ||
      item.keywords.some(word => word.includes(keyword))
  })

  const goToSearchResult = (item) => {
    navigate(item.path)
    setSearchTerm("")
    setSearchOpen(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()

    if (filteredSearchItems.length > 0) {
      goToSearchResult(filteredSearchItems[0])
    }
  }

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
<form
  onSubmit={handleSearchSubmit}
  className="relative w-full max-w-md mx-4"
>
  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => window.setTimeout(() => setSearchOpen(false), 120)}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setSearchOpen(true)
              }}
              placeholder="Search walking, grooming, adoption..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

  {searchOpen && searchTerm.trim() && (
    <div className="absolute left-0 right-0 top-12 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
      {filteredSearchItems.length > 0 ? (
        filteredSearchItems.map(item => (
          <button
            key={item.path}
            type="button"
            onClick={() => goToSearchResult(item)}
            className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50"
          >
            {item.title}
          </button>
        ))
      ) : (
        <p className="px-4 py-3 text-sm text-gray-500">
          No matching page found
        </p>
      )}
    </div>
  )}
</form>

          {/* Profile */}
<div className="ml-auto relative">         
   <div
  onClick={() => setProfileOpen(!profileOpen)}
  className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
>
{currentUser?.profilePhoto ? (
  <img
    src={currentUser.profilePhoto}
    alt="profile"
    className="w-full h-full object-cover"
  />
) : (
  <div className="w-full h-full bg-orange-500 text-white flex items-center justify-center font-bold">
    {currentUser?.name?.charAt(0)?.toUpperCase()}
  </div>
)}
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
