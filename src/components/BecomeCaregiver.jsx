import { Link } from "react-router-dom"

export default function BecomeCaregiver() {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-14">

        {/* IMAGE */}
        <div className="flex-1 flex justify-center">
 <img
  src="https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg?auto=compress&cs=tinysrgb&w=900"
  alt="Person walking dog"
  className="rounded-3xl shadow-xl w-full max-w-md h-105 object-cover"
/>
        </div>

        {/* TEXT */}
        <div className="flex-1">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
            Love dogs? <br />
            <span className="text-orange-500">
              Work with PawPaw 🐾
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-lg">
            Join PawPaw as a trusted dog walker or groomer. 
            Choose your schedule, earn money, and spend your day 
            with happy wagging tails.
          </p>

          <div className="mt-8">
            <Link
              to="/apply-caregiver"
              className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
            >
              Apply as Caregiver
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}