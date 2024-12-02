import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const handleBuyCardPacks = () => {
    navigate('/cardpack');
  };

  const handleListToMarketplace = (cardId) => {
    console.log(`Listing card with ID ${cardId} to marketplace.`);
    // Add your marketplace listing logic here
  };

  const collectionCards = [
    { id: 1, title: 'Card 1', image: '/logo512.png' },
    { id: 2, title: 'Card 2', image: 'https://via.placeholder.com/150' },
    { id: 3, title: 'Card 3', image: 'https://via.placeholder.com/150' },
    { id: 4, title: 'Card 4', image: 'https://via.placeholder.com/150' },
    { id: 5, title: 'Card 5', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className="landing-container">
      <div className="title-container">
        <h1 className="main-title">Zodeck, satisfy your card collecting itch here</h1>
        <button className="buy-card-packs-btn" onClick={handleBuyCardPacks}>
          Buy Card Packs
        </button>
      </div>
      <h2 className="section-title">Your Collection</h2>
      <div className="card-listing">
        {collectionCards.map((card) => (
          <div className="card-container" key={card.id}>
            <img src={card.image} alt={card.title} className="card-image" />
            <div className="card-overlay">
              <p className="card-title">{card.title}</p>
              <button
                className="hover-link"
                onClick={() => handleListToMarketplace(card.id)}
              >
                List to Marketplace
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="listings-title-container">
        <h3 className="section-title">Listings you may be interested in</h3>
        <a href="/marketplace" className="go-to-marketplace">
          Go to Marketplace &gt;&gt;
        </a>
      </div>

      <div className="marketplace-landing-listings">
        {[...Array(5)].map((_, index) => (
          <div className="marketplace-landing-card" key={index}>
            <div className="card-image"></div>
            <p className="card-price">{`Price: ${1 + index * 0.1} ETH`}</p>
            <p className="card-title">{`Card Title ${index + 1}`}</p>
            <button className="place-bid-btn">Place Your Bid</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
