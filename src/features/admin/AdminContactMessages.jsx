import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Mail, Phone } from "lucide-react"

export default function AdminContactMessages() {
  const token = localStorage.getItem("token")
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Failed to load contact messages")
        return
      }

      setMessages(data)
    } catch {
      toast.error("Failed to load contact messages")
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const updateStatus = async (id, nextStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      })

      const updated = await res.json()

      if (!res.ok) {
        toast.error(updated.message || "Could not update message")
        return
      }

      setMessages(prev => prev.map(msg => msg._id === id ? updated : msg))
      toast.success("Query updated")
    } catch {
      toast.error("Could not update message")
    }
  }

  const filtered = status
    ? messages.filter(message => message.status === status)
    : messages

  const newCount = messages.filter(message => message.status === "new").length

  if (loading) return <div className="p-10">Loading contact queries...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contact Queries</h1>
          <p className="text-gray-500 mt-1">
            {newCount} new query{newCount === 1 ? "" : "ies"} waiting for review
          </p>
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded-lg bg-white"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow">
          No contact queries found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(message => (
            <div key={message._id} className="bg-white rounded-xl shadow border border-gray-100 p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold">{message.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      message.status === "new"
                        ? "bg-orange-100 text-orange-700"
                        : message.status === "read"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {message.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>

                <select
                  value={message.status}
                  onChange={(e) => updateStatus(message._id, e.target.value)}
                  className="border px-3 py-2 rounded-lg bg-white"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm text-gray-700">
                <a href={`mailto:${message.email}`} className="flex items-center gap-2 hover:text-orange-600">
                  <Mail size={16} />
                  {message.email}
                </a>
                {message.phone && (
                  <a href={`tel:${message.phone}`} className="flex items-center gap-2 hover:text-orange-600">
                    <Phone size={16} />
                    {message.phone}
                  </a>
                )}
              </div>

              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-semibold text-gray-500">Subject</p>
                <p className="font-semibold">{message.subject || "General inquiry"}</p>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold text-gray-500">Message</p>
                <p className="text-gray-800 whitespace-pre-line">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
