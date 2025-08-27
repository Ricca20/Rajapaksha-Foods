import User from '../infastructure/infastructure.user.js';

// Clerk webhook handler for all user events (robust parsing + idempotent upserts)
export const handleWebhook = async (req, res) => {
  try {
    // Normalize/parse the incoming body to a JS object (supports raw Buffer/string/JSON)
    let event;
    if (Buffer.isBuffer(req.body)) {
      event = JSON.parse(req.body.toString());
    } else if (typeof req.body === 'string') {
      event = JSON.parse(req.body);
    } else {
      event = req.body;
    }

    const eventType = event?.type;
    const payload = event?.data;

    if (!payload) {
      return res.status(400).json({ success: false, error: 'No user data in webhook payload' });
    }

    // Map Clerk user -> our User model
    const getPrimaryEmail = (p) => {
      if (!Array.isArray(p?.email_addresses)) return '';
      // Try primary id first
      const primaryId = p.primary_email_address_id;
      if (primaryId) {
        const primary = p.email_addresses.find(e => e.id === primaryId);
        if (primary?.email_address) return primary.email_address;
      }
      // Fallback: first email
      return p.email_addresses[0]?.email_address || '';
    };

    const userData = {
      clerkId: payload.id,
      name: (payload.first_name || payload.given_name || '') + (payload.last_name || payload.family_name ? ` ${payload.last_name || payload.family_name}` : ''),
      email: getPrimaryEmail(payload),
      address: ''
    };

    if (!userData.clerkId || !userData.email) {
      return res.status(400).json({ success: false, error: 'Missing required fields clerkId or email' });
    }

    if (eventType === 'user.created') {
      // Idempotent create: upsert if not exists
      const result = await User.updateOne(
        { clerkId: userData.clerkId },
        { $setOnInsert: userData },
        { upsert: true }
      );
      return res.status(200).json({ success: true, upserted: result.upsertedCount === 1 });
    }

    if (eventType === 'user.updated') {
      const updated = await User.findOneAndUpdate(
        { clerkId: userData.clerkId },
        { $set: userData },
        { new: true }
      );
      return res.status(200).json({ success: true, user: updated });
    }

    if (eventType === 'user.deleted') {
      await User.deleteOne({ clerkId: userData.clerkId });
      return res.status(200).json({ success: true, deleted: true });
    }

    // Ignore other events
    return res.status(200).json({ success: true, message: 'Event ignored' });
  } catch (err) {
    // Handle duplicate key gracefully
    if (err?.code === 11000) {
      return res.status(200).json({ success: true, message: 'Duplicate (already processed)' });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const clerkNewUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};