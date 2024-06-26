import React from 'react';

function NewsFeed() {
  const news = [
    'Новость 1',
    'Новость 2',
    'Новость 3'
  ];

  return (
    <div className="news-feed">
      <h2>Лента новостей</h2>
      <ul>
        {news.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default NewsFeed;
