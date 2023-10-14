const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const User = require('./models/User');
const Question = require('./models/Question');
const Answer = require('./models/Answer');

app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.json());

const connectDB = require('./db');

connectDB();

app.get('/users', (req, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving users', error });
    });
});

const bcrypt = require('bcryptjs');
const saltRounds = 10;

app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  User.exists({ username })
    .then((userExists) => {
      if (userExists) {
        return res.status(409).json({ success: false, message: 'Username already taken' });
      }
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          res.status(500).json({ message: 'Error hashing password', err });
        } else {
          const newUser = new User({ username, password: hash, email, isAdmin: false });
          newUser.save()
            .then((newUser) => {
              res.json({ success: true, message: 'Registration successful', user: newUser });
            })
            .catch((error) => {
              res.status(500).json({ message: 'Error registering user', error });
            });
        }
      });
    });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            res.status(500).json({ message: 'Error authenticating', err });
          } else if (result) {
            res.send({ success: true, message: 'Login successful', user });
          } else {
            res.status(401).send({ success: false, message: 'Invalid username or password' });
          }
        });
      } else {
        res.status(401).send({ success: false, message: 'Invalid username or password' });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error logging in', error });
    });
});

app.put('/users/:username', (req, res) => {
  const username = req.params.username;

  User.findOneAndUpdate({ username: username }, req.body, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully', user: updatedUser.username });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error updating user', error });
    });
});


app.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  User.findByIdAndDelete(id)
    .then(() => {
      res.send('User deleted successfully');
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error deleting user', error });
    });
});

app.get('/questions', (req, res) => {
  Question.find()
    .then((questions) => {
      res.send(questions);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving questions', error });
    });
});

app.get('/questions/:id', (req, res) => {
  const id = req.params.id;

  Question.findById(id)
    .then((question) => {
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }

      res.send(question);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving question', error });
    });
});

app.post('/questions', (req, res) => {
  const { title, body, userId, tags } = req.body;

  if (!title || !body || !userId) {
    return res.status(400).json({ success: false, message: 'Title, body and userId are required' });
  }

  Question.exists({ title })
    .then((questionExists) => {
      if (questionExists) {
        return res.status(409).json({ success: false, message: 'Question already asked' });
      }

      const newQuestion = new Question({ title, body, userId, tags });
      return newQuestion.save();
    })
    .then((newQuestion) => {
      res.json({ success: true, message: 'Question added successfully', question: newQuestion });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error adding question', error });
    });
});



app.put('/questions/:id', (req, res) => {
  const id = req.params.id;
  const { title, body, userId } = req.body;

  if (!title && !body && !userId) {
    return res.status(400).json({ message: 'You must update at least one field.' });
  }

  Question.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedQuestion) => {
      if (!updatedQuestion) {
        return res.status(404).json({ message: 'Question not found' });
      }

      res.json({ message: 'Question updated successfully', question: updatedQuestion });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error updating question', error });
    });
});

app.delete('/questions/:id', (req, res) => {
  const id = req.params.id;

  Question.findByIdAndDelete(id)
    .then(() => {
      res.send('Question deleted successfully');
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error deleting question', error });
    });
});

app.get('/questions/user/:userId', (req, res) => {
  const userId = req.params.userId;

  Question.find({ userId })
    .then((questions) => {
      if (!questions) {
        return res.status(404).json({ message: 'Questions not found' });
      }

      res.send(questions);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving questions', error });
    });
});

app.post('/answers/:id/like', (req, res, next) => {
  const id = req.params.id;
  const userId = req.body.userId;

  Answer.findById(id)
    .then((answer) => {
      if (!answer) {
        return res.status(404).json({ message: 'Answer not found' });
      }

      if (!answer.likedBy) {
        answer.likedBy = [];
      }

      const index = answer.likedBy.indexOf(userId);
      if (index === -1) {
        answer.likedBy.push(userId);
        answer.likes += 1;
      } else {
        answer.likedBy.splice(index, 1);
        answer.likes -= 1;
      }

      return answer.save();
    })
    .then((updatedAnswer) => {
      res.json({ message: 'Answer liked successfully', answer: updatedAnswer });
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/answers/:id/dislike', (req, res, next) => {
  const id = req.params.id;
  const userId = req.body.userId;

  Answer.findById(id)
    .then((answer) => {
      if (!answer) {
        return res.status(404).json({ message: 'Answer not found' });
      }

      if (!answer.dislikedBy) {
        answer.dislikedBy = [];
      }

      const index = answer.dislikedBy.indexOf(userId);
      if (index === -1) {
        answer.dislikedBy.push(userId);
        answer.dislikes += 1;
      } else {
        answer.dislikedBy.splice(index, 1);
        answer.dislikes -= 1;
      }

      return answer.save();
    })
    .then((updatedAnswer) => {
      res.json({ message: 'Answer disliked successfully', answer: updatedAnswer });
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/answers', (req, res) => {
  Answer.find()
    .then((answers) => {
      res.send(answers);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving answers', error });
    });
});

app.get('/answers/:id', (req, res) => {
  const questionId = req.params.id;

  Answer.find({ questionId })
    .then((answers) => {
      res.send(answers);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving answers', error });
    });
});

app.post('/questions/:id/answers', (req, res) => {
  const questionId = req.params.id;
  const { body, userId } = req.body;

  if (!body || !userId) {
    return res.status(400).json({ success: false, message: 'Body and userId are required' });
  }

  Answer.exists({ body })
    .then((answerExists) => {
      if (answerExists) {
        return res.status(409).json({ success: false, message: 'Answer already posted' });
      }

      const newAnswer = new Answer({ questionId, body, userId });
      return newAnswer.save();
    })
    .then((newAnswer) => {
      res.json({ success: true, message: 'Answer added successfully', answer: newAnswer });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error adding question', error });
    });
});

app.get('/questions/:id/views', async (req, res) => {
  try {
    const questionId = req.params.id;

    // Najdi vprašanje v podatkovni bazi glede na ID
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: 'Vprašanje ni bilo najdeno' });
    }

    // Povečajte vrednost polja "views" za vprašanje za 1
    question.views += 1;

    // Shrani posodobljeno vprašanje v podatkovno bazo
    await question.save();

    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Napaka na strežniku' });
  }
});


app.get('/answers/question/:questionId/user/:userId', (req, res) => {
  const questionId = req.params.questionId;
  const userId = req.params.userId;

  Answer.find({ questionId, userId })
    .then((answers) => {
      if (answers.length === 0) {
        return res.status(404).json({ message: 'No answers found' });
      }

      res.json({ success: true, message: 'Answers retrieved successfully', answers });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving answers', error });
    });
});

app.put('/answers/:id', (req, res) => {
  const id = req.params.id;
  const { body, userId, questionId } = req.body;

  if (!body && !userId && !questionId) {
    return res.status(400).json({ message: 'You must update at least one field.' });
  }

  Answer.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedAnswer) => {
      if (!updatedAnswer) {
        return res.status(404).json({ message: 'Answer not found' });
      }

      res.json({ message: 'Answer updated successfully', answer: updatedAnswer });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error updating answer', error });
    });
});

app.delete('/answers/:id', (req, res) => {
  const id = req.params.id;

  Answer.findByIdAndDelete(id)
    .then(() => {
      res.send('Answer deleted successfully');
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error deleting answer', error });
    });
});

app.get('/answers/user/:userId', (req, res) => {
  const userId = req.params.userId;

  Answer.find({ userId })
    .then((answers) => {
      if (!answers) {
        return res.status(404).json({ message: 'Answer not found' });
      }

      res.send(answers);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving answers', error });
    });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});