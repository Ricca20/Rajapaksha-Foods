"use client"

import { useState } from "react"
import { sendMessage } from "../lib/contactApi";
import Navbar from "../components/Navbar";

export default function ContactUsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess("")
    setError("")
    setLoading(true)

    try {
      const payload = { ...form }
      await sendMessage(payload)
      setSuccess("Thank you — your message was sent successfully! We will get back to you soon.")
      setForm({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" })
    } catch (err) {
      console.error(err)
      setError(err?.message || "Failed to send message. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-white">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full opacity-5 -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full opacity-5 translate-x-48 translate-y-48"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-200 rounded-full opacity-3 -translate-x-32 -translate-y-32"></div>
      </div>

      <Navbar />
      <br />
      <br />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block">
            <h1 className="text-6xl md:text-7xl font-black text-black/80 mb-6 tracking-tight">
              Get In
              <span className="text-orange-500 block md:inline md:ml-4">Touch</span>
            </h1>
            <div className="w-24 h-1 bg-orange-300 mx-auto mb-6"></div>
          </div>
          <p className="text-xl text-black/60 max-w-2xl mx-auto font-medium leading-relaxed">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-300 relative">
          <div className="md:flex min-h-[600px]">
            {/* Company Info (left) */}
            <div className="md:w-2/5 bg-orange-200 text-black/70 p-12 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-black/20 rounded-full opacity-10 translate-x-16 -translate-y-16"></div>

              <div className="mb-10 relative z-10">
                <h2 className="text-4xl font-black mb-4 text-black/80">Rajapaksha Foods</h2>
                <p className="text-black/70 text-lg font-medium">Authentic Sri Lankan spices and food products</p>
                <div className="w-16 h-1 bg-black/50 mt-4"></div>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="flex items-start group">
                  <div className="bg-black/50 p-3 rounded-xl mr-6 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <svg
                      className="h-6 w-6 text-white/80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-black/80 mb-1">Address</h3>
                    <p className="text-black/60 font-medium">123 Kandy Road, Colombo, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-black/50 p-3 rounded-xl mr-6 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <svg
                      className="h-6 w-6 text-white/80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-black/80 mb-1">Phone</h3>
                    <p className="text-black/60 font-medium">+94 77 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-black/50 p-3 rounded-xl mr-6 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <svg
                      className="h-6 w-6 text-white/80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-black/80 mb-1">Email</h3>
                    <p className="text-black/60 font-medium">support@rajapakshafoods.lk</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-black/50 p-3 rounded-xl mr-6 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <svg
                      className="h-6 w-6 text-white/80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-black/80 mb-1">Business Hours</h3>
                    <p className="text-black/60 font-medium">Mon - Fri: 8:00 AM — 6:00 PM</p>
                    <p className="text-black/60 font-medium">Sat: 9:00 AM — 2:00 PM</p>
                    <p className="text-black/60 font-medium">Sun: Closed</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t-2 border-black/50 relative z-10">
                <p className="text-black/60 font-medium text-lg mb-4">
                  Follow us on social media for updates and special offers!
                </p>
                <div className="flex space-x-4">
                  <div className="bg-black/50 h-12 w-12 rounded-xl flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                    <svg className="h-6 w-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="bg-black/50 h-12 w-12 rounded-xl flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                    <svg className="h-6 w-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </div>
                  <div className="bg-black/50 h-12 w-12 rounded-xl flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                    <svg className="h-6 w-6 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form (right) */}
            <div className="md:w-3/5 p-12 bg-white">
              <div className="mb-8">
                <h2 className="text-4xl font-black text-black/70 mb-2">Send us a message</h2>
                <div className="w-16 h-1 bg-orange-300"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {success && (
                  <div className="p-6 text-black/70 bg-orange-100 rounded-2xl border-2 border-orange-300 flex items-start">
                    <svg
                      className="h-6 w-6 text-orange-300 mr-4 flex-shrink-0 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">{success}</span>
                  </div>
                )}
                {error && (
                  <div className="p-6 text-black/70 bg-black/20 rounded-2xl border-2 border-orange-300 flex items-start">
                    <svg
                      className="h-6 w-6 text-orange-300 mr-4 flex-shrink-0 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-lg font-bold text-black/70 mb-3" htmlFor="name">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border-2 border-black/50 rounded-xl focus:ring-4 focus:ring-orange-300/30 focus:border-orange-300 transition-all duration-200 text-lg font-medium bg-white"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-black/70 mb-3" htmlFor="email">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border-2 border-black/50 rounded-xl focus:ring-4 focus:ring-orange-300/30 focus:border-orange-300 transition-all duration-200 text-lg font-medium bg-white"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-lg font-bold text-black/70 mb-3" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border-2 border-black/50 rounded-xl focus:ring-4 focus:ring-orange-300/30 focus:border-orange-300 transition-all duration-200 text-lg font-medium bg-white"
                      placeholder="+94 77 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-black/70 mb-3" htmlFor="subject">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border-2 border-black/50 rounded-xl focus:ring-4 focus:ring-orange-300/30 focus:border-orange-300 transition-all duration-200 bg-white text-lg font-medium"
                    >
                      <option>General Inquiry</option>
                      <option>Wholesale</option>
                      <option>Feedback</option>
                      <option>Complaint</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-bold text-black/70 mb-3" htmlFor="message">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 border-2 border-black/50 rounded-xl focus:ring-4 focus:ring-orange-300/30 focus:border-orange-300 transition-all duration-200 text-lg font-medium bg-white resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-12 py-5 bg-orange-300 hover:bg-black/60 text-black/70 hover:text-white font-black text-xl rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center border-2 border-orange-300 hover:border-black/60"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-4 h-6 w-6 text-current"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg
                          className="ml-3 h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
