import express from 'express';
import Newsletter from '../models/Newsletter.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  // Email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  try {
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already subscribed' });
    }

    const newEntry = new Newsletter({ email });
    await newEntry.save();
    return res.status(200).json({ success: true, message: 'Email subscribed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
