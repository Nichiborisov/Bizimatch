import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [geoLocation, setGeoLocation] = useState({ lat: '', lng: '' });
  const [interests, setInterests] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }

      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
          setName(data.user.name);
          setEmail(data.user.email);
          setGeoLocation({
            lat: data.user.geoLocation.coordinates[1],
            lng: data.user.geoLocation.coordinates[0]
          });
          setInterests(data.user.interests.join(', '));
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Ошибка получения профиля', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          geoLocation: {
            type: 'Point',
            coordinates: [parseFloat(geoLocation.lng), parseFloat(geoLocation.lat)]
          },
          interests: interests.split(',').map((interest) => interest.trim())
        })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setEditMode(false);
      } else {
        console.error('Ошибка обновления профиля', data);
      }
    } catch (error) {
      console.error('Ошибка обновления профиля', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h1>Профиль</h1>
      {editMode ? (
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="text"
            value={geoLocation.lat}
            onChange={(e) => setGeoLocation({ ...geoLocation, lat: e.target.value })}
            placeholder="Широта"
          />
          <input
            type="text"
            value={geoLocation.lng}
            onChange={(e) => setGeoLocation({ ...geoLocation, lng: e.target.value })}
            placeholder="Долгота"
          />
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Интересы (через запятую)"
          />
          <button onClick={handleSave}>Сохранить</button>
        </div>
      ) : (
        <div>
          <p>Имя: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Геолокация: {geoLocation.lat}, {geoLocation.lng}</p>
          <p>Интересы: {user.interests.join(', ')}</p>
          <button onClick={() => setEditMode(true)}>Редактировать</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
