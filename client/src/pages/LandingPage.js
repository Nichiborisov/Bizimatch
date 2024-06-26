import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Добро пожаловать в BizMatch</h1>
        <p>Найдите подходящих бизнес-партнеров и расширьте свои возможности.</p>
        <div className="landing-buttons">
          <Link to="/register" className="landing-button">Регистрация</Link>
          <Link to="/login" className="landing-button">Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
