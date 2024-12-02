import React, { useState } from 'react';
import './Collection.css';
import { useNavigate } from 'react-router-dom';

const Collection = () => {
    const navigate = useNavigate();
    const [selectedCard, setSelectedCard] = useState(null);

    const collectionCards = [
        { id: 1, title: 'Card Title 1', image: '/cardImages/0.png' },
        { id: 2, title: 'Card Title 2', image: '/cardImages/1.png' },
        { id: 3, title: 'Card Title 3', image: '/cardImages/2.png' },
        { id: 4, title: 'Card Title 4', image: '/cardImages/3.png' },
        { id: 5, title: 'Card Title 5', image: '/cardImages/4.png' },
        { id: 6, title: 'Card Title 6', image: '/cardImages/5.png' },
        { id: 7, title: 'Card Title 7', image: '/cardImages/0.png' },
        { id: 8, title: 'Card Title 8', image: '/cardImages/2.png' },
        { id: 9, title: 'Card Title 9', image: '/cardImages/1.png' },
        { id: 10, title: 'Card Title 10', image: '/cardImages/3.png' },
        { id: 11, title: 'Card Title 11', image: '/cardImages/4.png' },
        { id: 12, title: 'Card Title 12', image: '/cardImages/5.png' },
        { id: 13, title: 'Card Title 13', image: '/cardImages/0.png' },
    ];

    const handleViewCard = (listing) => {
        setSelectedCard(listing);
        navigate(`/collection/card/${listing.id}`, {state: {card: listing}});
    };
  
    return(
        <div className='collections-container'>
            <div className='title-container'>
                <h1 className="main-title">Collections</h1>
                <div className="filter-container">
                    <span className="filter-item active">All</span>
                    <span className="filter-item">Favourites</span>
                    <span className="filter-item">Shiny</span>
                    <span className="filter-item">Animal</span>
                </div>
            </div>
            <div className='collections-content'>
                {collectionCards.map((listing) => (
                    <div 
                        className="collections-card" 
                        key={listing.id}
                        onClick={() => handleViewCard(listing)}
                    >
                        <img 
                            src={listing.image} 
                            className="collections-card-image" 
                        />
                        <p className="card-title">{listing.title}</p>
                    </div>
                ))}
            </div>
        </div>

        
    );
};

export default Collection;