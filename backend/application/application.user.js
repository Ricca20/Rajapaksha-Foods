import User from '../infastructure/infastructure.user.js';

// Clerk webhook handler with correct field mapping
export const ClerkNewUser = async (req, res) => {
  try {
    const payload = req.body;
    const userData = {
      clerkId: payload.id, // Clerk's user id
      name: payload.first_name && payload.last_name ? `${payload.first_name} ${payload.last_name}` : payload.username || '',
      email: payload.email_addresses && payload.email_addresses[0] ? payload.email_addresses[0].email_address : '',
      address: '' // Fill if you collect address elsewhere
    };
    if (!userData.clerkId || !userData.email) {
      return res.status(400).json({ success: false, error: 'Missing required fields clerkId or email' });
    }
    const user = new User(userData);
    await user.save();
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const clerkNewUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};



