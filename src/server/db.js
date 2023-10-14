const mongoose = require('mongoose');

const connectDB = () => {
    const mongoDB = 'mongodb+srv://marija:maca2401@cluster0.4woseix.mongodb.net/'; // Replace with your actual MongoDB cluster connection string
  
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
      });
  };

module.exports = connectDB;
