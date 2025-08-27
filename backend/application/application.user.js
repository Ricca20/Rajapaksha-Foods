import User from '../infastructure/infastructure.user.js';
import { Webhook } from 'svix';

// Clerk webhook handler for all user events (robust parsing + idempotent upserts)
export const handleWebhook = async (req, res) => {
  try {
    // Collect required Svix headers
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ success: false, error: 'Missing Svix headers' });
    }

    // Get raw payload string (supports raw Buffer / string / JSON)
    let payloadString;
    if (Buffer.isBuffer(req.body)) payloadString = req.body.toString('utf8');
    else if (typeof req.body === 'string') payloadString = req.body;
    else payloadString = JSON.stringify(req.body || {});

    // Verify with Svix
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, error: 'Missing CLERK_WEBHOOK_SECRET' });
    }
    const wh = new Webhook(secret);
    let event;
    try {
      event = wh.verify(payloadString, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (e) {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    const eventType = event?.type;
    const payload = event?.data;
    if (!payload) {
      return res.status(400).json({ success: false, error: 'No user data in webhook payload' });
    }

    // Map Clerk user -> our User model
    const getPrimaryEmail = (p) => {
      if (!Array.isArray(p?.email_addresses)) return '';
      const primaryId = p.primary_email_address_id;
      if (primaryId) {
        const primary = p.email_addresses.find(e => e.id === primaryId);
        if (primary?.email_address) return primary.email_address;
      }
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

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const user = await User.findOneAndUpdate(
        { clerkId: userData.clerkId },
        { $set: userData },
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, user });
    }

    if (eventType === 'user.deleted') {
      await User.deleteOne({ clerkId: userData.clerkId });
      return res.status(200).json({ success: true, deleted: true });
    }

    return res.status(200).json({ success: true, message: 'Event ignored' });
  } catch (err) {
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