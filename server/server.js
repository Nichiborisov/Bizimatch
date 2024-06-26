require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bizmatch', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User model
const UserSchema = new mongoose.Schema({
  companyName: String,
  email: String,
  password: String,
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model('User', UserSchema);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes
app.post('/api/register', async (req, res) => {
  const { companyName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ companyName, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const url = `http://localhost:3000/confirmation/${token}`;

    await transporter.sendMail({
      to: email,
      subject: 'Подтверждение электронной почты',
      html: `<p>Подтвердите свою электронную почту, перейдя по <a href="${url}">этой ссылке</a>.</p>`,
    });

    res.status(201).send('Пользователь зарегистрирован. Проверьте свою почту для подтверждения.');
  } catch (error) {
    res.status(500).send('Ошибка регистрации.');
  }
});

app.get('/api/confirmation/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).send('Некорректная ссылка подтверждения.');
    }

    user.isVerified = true;
    await user.save();

    res.send('Электронная почта подтверждена.');
  } catch (error) {
    res.status(500).send('Ошибка подтверждения электронной почты.');
  }
});

// Start server
app.listen(5000, () => console.log('Server started on port 5000'));
