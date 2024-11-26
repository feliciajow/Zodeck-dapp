import React from 'react';
import './Cardpack.css';

const CardPack = () => {
  return (
    <div className="cardpack-container">
      <div className="cardpack-content">
        <img src="/logo512.png" alt="Card Pack" className="cardpack-image" />
        <div className="cardpack-info">
          <p>Shiny - 0.000001%</p>
          <p>Animal - 25%</p>
        </div>
      </div>
      <button className="open-cardpack-btn">Open Card Pack 1000💰</button>
    </div>
  );
};

export default CardPack;