import User from '../infastructure/infastructure.user.js';

export const ClerkNewUser = async (req, res) => {
  try {
    const payload = req.body;
    
    const userData = {
      Id: payload.id, 
      name: payload.first_name && payload.last_name ? `${payload.first_name} ${payload.last_name}` : payload.username || '',
      email: payload.email_addresses && payload.email_addresses[0] ? payload.email_addresses[0].email_address : '',
      address: '' 
    };
    const user = new User(userData);
    await user.save();
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



