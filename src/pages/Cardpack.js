import React from 'react';
import './Cardpack.css';
import BuyPackButton from './buyPackButton';
import { useNavigate } from 'react-router-dom';


const CardPack = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleOpenCardPacks = () => {
    navigate('/cardpackresults');
  };

  return (
    <div className="cardpack-container">
      <div className="cardpack-content">
        <img src="/logo512.png" alt="Card Pack" className="cardpack-image" />
        <div className="cardpack-info">
          <p>Shiny - 0.000001%</p>
          <p>Animal - 25%</p>
        </div>
      </div>
      <div className="cardpack-btn-container">
        <button 
          className="cardpack-back-btn"
          onClick={handleBack}
        >
          Back
        </button>
        {/* <button 
          className="open-cardpack-btn"
          onClick={handleOpenCardPacks}
        >
          Open Card Pack 1000💰
        </button> */}
        <BuyPackButton />
      </div>
    </div>
  );
};

export default CardPack;