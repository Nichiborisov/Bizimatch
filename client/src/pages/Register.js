import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения.');
        setError('');

        // Отправка письма для подтверждения
        await fetch('http://localhost:5000/api/send-confirmation-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        });
      } else {
        setError(data.message || 'Ошибка при регистрации.');
        setMessage('');
      }
    } catch (err) {
      setError('Ошибка при регистрации.');
      setMessage('');
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        <h2>Регистрация</h2>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyName">Название компании, ИП, стартапа или имя инвестора</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Электронная почта</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="register-button">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
