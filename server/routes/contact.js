import express from 'express';
import Contact from '../models/Contact.js';
import { isSeller } from '../middleware/auth.js';

const router = express.Router();

// Submit contact form (public route)
router.post('/send', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const contact = new Contact({
            name,
            email,
            message
        });

        await contact.save();
        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
});

// Get all messages (seller only)
router.get('/messages', isSeller, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
});

export default router; 