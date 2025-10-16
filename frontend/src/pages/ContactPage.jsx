import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: <MapPin className="w-8 h-8 text-orange-500" />,
      title: "Our Location",
      details: ["SLIIT Malabe Campus", "New Kandy Rd, Malabe", "Sri Lanka"],
      link: "https://maps.google.com"
    },
    {
      icon: <Phone className="w-8 h-8 text-orange-500" />,
      title: "Phone Number",
      details: ["+94 77 123 4567", "+94 11 234 5678"],
      link: "tel:+94771234567"
    },
    {
      icon: <Mail className="w-8 h-8 text-orange-500" />,
      title: "Email Address",
      details: ["info@rajapakshafoods.lk", "support@rajapakshafoods.lk"],
      link: "mailto:info@rajapakshafoods.lk"
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-500" />,
      title: "Working Hours",
      details: ["Monday - Sunday", "9:00 AM - 10:00 PM"],
      link: null
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-orange-50 to-white pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
              <span className="text-gray-900">Get in </span>
              <span className="text-orange-500">Touch</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gray-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100
                           hover:scale-105 hover:shadow-2xl hover:border-orange-300 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full 
                                  bg-orange-50 group-hover:bg-orange-100 transition">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition">
                    {info.title}
                  </h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                  {info.link && (
                    <a
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-medium 
                                 hover:underline transition"
                    >
                      {info.title === "Our Location" ? "View on Map →" : "Contact Now →"}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="w-8 h-8 text-orange-500" />
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Send us a <span className="text-orange-500">Message</span>
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                                 focus:ring-orange-500 focus:border-orange-500 transition outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                                 focus:ring-orange-500 focus:border-orange-500 transition outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                                 focus:ring-orange-500 focus:border-orange-500 transition outline-none"
                      placeholder="+94 77 123 4567"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                                 focus:ring-orange-500 focus:border-orange-500 transition outline-none"
                      placeholder="How can we help?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                                 focus:ring-orange-500 focus:border-orange-500 transition outline-none resize-none"
                      placeholder="Tell us what you think..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 rounded-xl bg-orange-500 text-white font-semibold 
                               shadow-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                               flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>

                  {/* Success Message */}
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm"
                    >
                      ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467674779!2d79.9729!3d6.9147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae256db1a6771c5%3A0x2c63e344ab9a7536!2sSri%20Lanka%20Institute%20of%20Information%20Technology!5e0!3m2!1sen!2slk!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Rajapaksha Foods Location"
                ></iframe>
              </div>

              {/* Why Contact Us */}
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl p-8 shadow-2xl text-white">
                <h3 className="text-2xl font-bold mb-4">Why Contact Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-white text-xl">✓</span>
                    <span>Quick response within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white text-xl">✓</span>
                    <span>Friendly and helpful customer support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white text-xl">✓</span>
                    <span>Custom catering and bulk order inquiries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white text-xl">✓</span>
                    <span>Feedback and suggestions always welcome</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Frequently Asked <span className="text-orange-500">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "What are your delivery hours?",
                a: "We deliver from 9:00 AM to 10:00 PM, Monday through Sunday."
              },
              {
                q: "Do you cater for events?",
                a: "Yes! We offer catering services for events, parties, and corporate functions. Contact us for custom quotes."
              },
              {
                q: "What areas do you deliver to?",
                a: "We currently deliver to Malabe and surrounding areas. Contact us to check if we deliver to your location."
              },
              {
                q: "How can I track my order?",
                a: "Once you place an order, you can track it in real-time through your account dashboard."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-orange-300 
                           hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-orange-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Ready to <span className="text-orange-500">Order?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Browse our delicious menu and get your favorite Sri Lankan dishes delivered fresh!
          </p>
          <a href="/menu">
            <button className="px-10 py-4 rounded-xl bg-orange-500 text-white text-lg font-semibold 
                             shadow-lg hover:bg-orange-600 hover:scale-105 transition-all">
              View Menu →
            </button>
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
