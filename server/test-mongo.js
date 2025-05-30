const mongoose = require('mongoose');

async function test() {
    try {
        await mongoose.connect('mongodb://localhost:27017/employee_feedback_portal');
        console.log('MongoDB connected successfully');
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

test();