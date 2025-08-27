import User from '../infastructure/infastructure.user.js';

// Clerk webhook handler for all user events
export const handleWebhook = async (req, res) => {
  try {
    const eventType = req.body.type;
    const payload = req.body.data;

    console.log('Received webhook event:', eventType, payload);
    if (!payload) {
      return res.status(400).json({ success: false, error: 'No user data in webhook payload' });
    }

    // Common user data mapping
    const userData = {
      clerkId: payload.id,
      name: payload.first_name && payload.last_name ? `${payload.first_name} ${payload.last_name}` : payload.username || '',
      email: payload.email_addresses && payload.email_addresses[0] ? payload.email_addresses[0].email_address : '',
      address: '' // Fill if you collect address elsewhere
    };

    if (!userData.clerkId || !userData.email) {
      return res.status(400).json({ success: false, error: 'Missing required fields clerkId or email' });
    }

    let user;
    if (eventType === 'user.created') {
      user = new User(userData);
      await user.save();
      return res.status(201).json({ success: true, user });
    } else if (eventType === 'user.updated') {
      user = await User.findOneAndUpdate(
        { clerkId: userData.clerkId },
        userData,
        { new: true, upsert: false }
      );
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found for update' });
      }
      return res.status(200).json({ success: true, user });
    } else if (eventType === 'user.deleted') {
      user = await User.findOneAndDelete({ clerkId: userData.clerkId });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found for deletion' });
      }
      return res.status(200).json({ success: true, deleted: true });
    } else {
      // Ignore other events
      return res.status(200).json({ success: true, message: 'Event ignored' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const clerkNewUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};