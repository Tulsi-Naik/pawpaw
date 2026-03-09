import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-16">
      <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-extrabold text-white">
            Paw<span className="text-orange-500">Paw</span>
          </h3>
          <p className="mt-4 text-gray-400">
            Making dog parenting simple, joyful and stress-free.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/services" className="hover:text-white transition">
                Dog Walking
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition">
                Grooming
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition">
                Fresh Meals
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              Careers
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold text-white mb-4">Follow Us</h4>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">Instagram</li>
            <li className="hover:text-white cursor-pointer">Facebook</li>
            <li className="hover:text-white cursor-pointer">Twitter</li>
          </ul>
        </div>

      </div>

      <div className="mt-16 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} PawPaw. All rights reserved.
      </div>
    </footer>
  )
}