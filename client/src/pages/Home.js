import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1>Добро пожаловать, [Имя пользователя]</h1>
        <p>Это ваша домашняя страница. Вы можете перейти к своему профилю или чату.</p>
        <div className="home-buttons">
          <Link to="/profile" className="home-button">Профиль</Link>
          <Link to="/chat" className="home-button">Чат</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
