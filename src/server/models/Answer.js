const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: String,
  body: String,
  userId: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [String],
  dislikedBy: [String],
}, { collection: 'answers' });

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
