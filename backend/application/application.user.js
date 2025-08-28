// application.user.js
import User from "../infastructure/infastructure.user.js";
import { Webhook } from "svix";

export const handleWebhook = async (req, res) => {
  try {
    const payload = req.body;
    const headers = req.headers;

    
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    let evt;
    try {
      evt = wh.verify(JSON.stringify(payload), {
        "svix-id": headers["svix-id"],
        "svix-timestamp": headers["svix-timestamp"],
        "svix-signature": headers["svix-signature"],
      });
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }

    const { type, data } = evt;

    // ---- Handle Clerk events ----
    switch (type) {
      case "user.created": {
        const newUser = {
          clerkId: data.id,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses?.[0]?.email_address || "",
        };

        await User.findOneAndUpdate({ clerkId: data.id }, newUser, {
          upsert: true,
          new: true,
        });

        return res.status(200).json({ success: true, message: "User created" });
      }

      case "user.updated": {
        const updatedUser = {
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses?.[0]?.email_address || "",
        };

        await User.findOneAndUpdate({ clerkId: data.id }, updatedUser, {
          new: true,
        });

        return res.status(200).json({ success: true, message: "User updated" });
      }

      case "user.deleted": {
        await User.findOneAndDelete({ clerkId: data.id });

        return res.status(200).json({ success: true, message: "User deleted" });
      }

      default:
        return res.status(200).json({ success: true, message: "Event ignored" });
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get a user by Clerk ID
export const getUserByClerkId = async (req, res) => {
  try {
    const { clerkId } = req.params;
    if (!clerkId) {
      return res.status(400).json({ success: false, message: "clerkId is required" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("getUserByClerkId error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update a user's address by Clerk ID
export const updateUserAddress = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { street, city, postalCode, phone } = req.body || {};

    if (!clerkId) {
      return res.status(400).json({ success: false, message: "clerkId is required" });
    }

    // Minimal validation; accept partial updates
    const update = { address: { street, city, postalCode, phone } };

    const updated = await User.findOneAndUpdate(
      { clerkId },
      { $set: update },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("updateUserAddress error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
