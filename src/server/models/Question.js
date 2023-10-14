const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: String,
  body: String,
  userId: String,
  views: { type: Number, default: 0 },
  tags: [{ type: String }], // Novo polje za oznake
}, { collection: 'questions' });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
