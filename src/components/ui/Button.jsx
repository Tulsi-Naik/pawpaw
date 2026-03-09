export default function Button({ children, type = "button" }) {
  return (
    <button
      type={type}
      className="w-full bg-orange-500 text-white py-4 rounded-2xl 
      font-semibold text-lg shadow-md 
      hover:bg-orange-600 hover:scale-[1.02] 
      transition-all duration-300"
    >
      {children}
    </button>
  )
}