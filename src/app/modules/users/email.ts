// Express route: GET /api/users/email/:email

import { Router } from 'express';
const router = Router();
import { Request, Response } from 'express';
import { User } from '../auth/auth.model';

// Adjust path if needed
router.get(
  '/email/:email',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.params.email });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },
);
