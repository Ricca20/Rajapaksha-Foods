import { getAuth } from '@clerk/clerk-sdk-node';
import {Order} from '../infastructure/infastructure.order.js';
export const requireAdmin = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Please sign in first',
        redirect: '/'
      });
    }

    const role = auth.sessionClaims?.metadata?.role;
    if (role === 'admin') {
      return next();
    }

    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'This area is restricted to administrators only',
      redirect: '/'
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'An authentication error occurred',
      redirect: '/'
    });
  }
}
