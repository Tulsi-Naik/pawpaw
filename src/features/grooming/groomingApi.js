import axios from "axios"

export const bookGrooming = async (data) => {
  const token = localStorage.getItem("token")

  const res = await axios.post(
    "http://localhost:5000/api/bookings/create",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return res.data
}