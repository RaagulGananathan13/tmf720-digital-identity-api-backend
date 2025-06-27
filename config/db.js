const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://raagulgana:2P2K7QTsmOCbVKA3@digitalidentitymanageme.sk4zi5t.mongodb.net/?retryWrites=true&w=majority&appName=DigitalIdentityManagement', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
