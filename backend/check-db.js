const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        const users = await User.find({});
        console.log('Total users:', users.length);
        console.log('Users:', users.map(u => u.email));
        process.exit(0);
    } catch (err) {
        console.error('DB check error:', err);
        process.exit(1);
    }
}

checkUsers();
