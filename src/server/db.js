const mongoose = require('mongoose');

const connectDB = () => {
    const mongoDB = 'mongodb+srv://nixi2126:115155@cluster0.pooyjtt.mongodb.net/spletne'; // Replace with your actual MongoDB cluster connection string
  
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
      });
  };

module.exports = connectDB;
