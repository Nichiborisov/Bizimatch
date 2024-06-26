import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/confirmation/${token}`);
        const data = await response.text();
        
        if (response.ok) {
          setMessage('Электронная почта подтверждена. Вы можете войти.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setMessage(data);
        }
      } catch (error) {
        setMessage('Ошибка подтверждения электронной почты.');
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return (
    <div className="confirmation-page">
      <h2>{message}</h2>
    </div>
  );
};

export default Confirmation;
