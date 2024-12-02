import React from 'react';
import './CardpackResults.css';
import { useNavigate } from 'react-router-dom';

const CardpackResults = () => {
    const navigate = useNavigate();

    const handleOpenAnotherPack = () => {
        navigate('/cardpack');
    }

    const handleViewCollection = () => {
        navigate('/collection');
    }
    return (
        <div className="cardpack-results-container">
            <div className="cardpack-results-content">
                {[
                { index: 1, image:'/cardImages/0.png', title: 'Your Brain social media addiction' },
                { index: 2, image:'/cardImages/1.png', title: 'Land damaged by me and nature' },
                { index: 3, image:'/cardImages/2.png', title: 'Aurora Wave Dark Purple Magma Tone' },
                { index: 4, image:'/cardImages/3.png', title: "Ancient coins from China's past" },
                { index: 5, image:'/cardImages/4.png', title: 'Yellow sea coral preserved by me' },
                { index: 6, image:'/cardImages/5.png', title: 'Your Brain social media addiction' },
                { index: 7, image:'/cardImages/0.png', title: 'Your Brain social media addiction' },
                { index: 8, image:'/cardImages/1.png', title: 'Land damaged by me and nature' },
                { index: 9, image:'/cardImages/2.png', title: 'Aurora Wave Dark Purple Magma Tone' },
                { index: 10, image:'/cardImages/3.png', title: "Ancient coins from China's past" },
                ].map((listing, index) => (
                    <div className="result-card" key={index}>
                        <img src={listing.image} className="result-card-image" />
                        <p className="card-title">{listing.title}</p>
                    </div>
                ))}
            </div>
            <div className='button-container'>
                <button 
                    className="open-another-cardpack-btn"
                    onClick={handleOpenAnotherPack}
                >
                    Open Another Pack 1000💰
                </button>
                <button 
                    className="view-collection-btn"
                    onClick={handleViewCollection}
                >
                    View Collection
                </button>
            </div>
            
        </div>
    );
};

export default CardpackResults;