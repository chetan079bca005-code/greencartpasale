// Script to fix users with missing passwords
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const fixUsersWithoutPasswords = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find users without passwords
        const usersWithoutPassword = await User.find({
            $or: [
                { password: { $exists: false } },
                { password: null },
                { password: '' }
            ]
        });

        console.log(`Found ${usersWithoutPassword.length} users without valid passwords`);

        if (usersWithoutPassword.length === 0) {
            console.log('All users have valid passwords!');

            // Let's also check all users for debugging
            const allUsers = await User.find({}).select('email password name');
            console.log('\nAll users in database:');
            allUsers.forEach(u => {
                console.log(`  - ${u.email}: password ${u.password ? 'EXISTS (' + u.password.substring(0, 15) + '...)' : 'MISSING'}`);
            });

            await mongoose.disconnect();
            return;
        }

        // Set a default password for users without passwords
        const defaultPassword = 'Password123!'; // Meets the password requirements
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        for (const user of usersWithoutPassword) {
            await User.findByIdAndUpdate(user._id, { password: hashedPassword });
            console.log(`Fixed user: ${user.email}`);
        }

        console.log(`\nFixed ${usersWithoutPassword.length} users`);
        console.log(`Default password set to: ${defaultPassword}`);
        console.log('Please ask users to change their passwords after logging in.');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixUsersWithoutPasswords();
