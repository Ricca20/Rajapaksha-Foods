import User from '../infastructure/infastructure.user.js';

export const handleWebhook = async (req, res) => {
  try {
    const { type, data } = req.body; // Clerk sends event type + user data
    const clerkId = data.id;

    switch (type) {
      case "user.created":
        await User.create({
          clerkId,
          name: data.first_name + " " + (data.last_name || ""),
          email: data.email_addresses?.[0]?.email_address,
          address: data.public_metadata?.address || "", // optional
        });
        console.log("User created:", data.id);
        break;

      case "user.updated":
        await User.findOneAndUpdate(
          { clerkId },
          {
            name: data.first_name + " " + (data.last_name || ""),
            email: data.email_addresses?.[0]?.email_address,
            address: data.public_metadata?.address || "",
          },
          { new: true }
        );
        console.log("User updated:", data.id);
        break;

      case "user.deleted":
        await User.findOneAndDelete({ clerkId });
        console.log("User deleted:", data.id);
        break;

      default:
        console.log("Unhandled webhook event:", type);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};