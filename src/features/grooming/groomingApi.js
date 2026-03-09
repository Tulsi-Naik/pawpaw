import axios from "axios"

export const bookGrooming = async (data) => {
  const token = localStorage.getItem("token")

  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/bookings/create`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return res.data
}