// controllers/contact.controller.js
import Contact from "../infastructure/infastructure.contact.js";

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
export const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    // Create new contact document
    const newMessage = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    await newMessage.save();

    return res.status(201).json({
      message: "Message submitted successfully.",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return res.status(500).json({ message: "Server error. Could not send message." });
  }
};
