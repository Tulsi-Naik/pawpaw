import axios from "axios"

export const bookGrooming = async (data) => {
  const token = localStorage.getItem("token")

  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/bookings/create`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return res.data
}