import React from 'react';
import './ViewCard.css';
import { useLocation } from 'react-router-dom';

const ViewCard = () => {
    const location = useLocation();
    const { card } = location.state;

    const handleListToMarketplace = (cardId) => {
        console.log(`Listing card with ID ${cardId} to marketplace.`);
        // Add your marketplace listing logic here
    };

    const handleAddToFavourites = (cardId) => {    // not sure if we are implementing this
        console.log(`Listing card with ID ${cardId} to marketplace.`);
        // Add your add to favourites logic here
    };

    return (
        <div className="view-card-container">
            <div className="view-card-content">
                <img className='view-card-image' src={card.image} alt={card.title} />
                <h1>{card.title}</h1>
            </div>
            <div className="view-card-btn-container">
                <button 
                    className="sell-btn" 
                    onClick={() => handleListToMarketplace}
                >
                    Sell on Marketplace
                </button>
                <button 
                    className="favourite-btn"
                    onClick={() => handleAddToFavourites}
                >
                    Add to Favourites
                </button>
            </div>
        </div>
    );
};

export default ViewCard;