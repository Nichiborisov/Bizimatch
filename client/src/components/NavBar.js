import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css'; // Создадим отдельный файл стилей для NavBar

function NavBar() {
  const location = useLocation();

  // Проверяем, находимся ли мы на страницах регистрации или входа
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-home-icon">
          <img src="/home-icon.png" alt="Дом" /> {/* Добавьте иконку домика */}
        </Link>
      </div>
      <div className="navbar-right">
        {isAuthPage ? (
          <>
            <Link to="/login">Войти</Link>
            <Link to="/register">Регистрация</Link>
          </>
        ) : (
          <>
            <Link to="/login">Войти</Link>
            <Link to="/register">Регистрация</Link>
            {/* Добавьте другие кнопки, если необходимо */}
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
