const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Путь к вашей модели пользователя
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Настройка nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Маршрут для регистрации
router.post('/register', async (req, res) => {
  const { companyName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с такой электронной почтой уже существует.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ companyName, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Подтверждение электронной почты',
      text: `Пожалуйста, подтвердите вашу электронную почту, перейдя по следующей ссылке: http://localhost:3000/confirmation/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Ошибка при отправке письма:', error);
        return res.status(500).json({ message: 'Ошибка при отправке письма с подтверждением.' });
      }
      res.status(201).json({ message: 'Регистрация успешна! Проверьте вашу почту для подтверждения.' });
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Ошибка при регистрации.' });
  }
});

module.exports = router;