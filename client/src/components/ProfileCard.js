import React from 'react';

function ProfileCard({ profile, onSwipe }) {
  return (
    <div className="profile-card">
      <img src={profile.avatar} alt={profile.name} />
      <h2>{profile.name}</h2>
      <p>{profile.description}</p>
      <button onClick={() => onSwipe('left', profile._id)}>❌</button>
      <button onClick={() => onSwipe('right', profile._id)}>✔️</button>
    </div>
  );
}

export default ProfileCard;
