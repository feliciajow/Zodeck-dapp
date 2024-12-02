import React from 'react';
import './Marketplace.css';

const Marketplace = () => {

  return (
    <>
      <div className="marketplace-container">
        <div className="title-container">
          <h1 className="main-title">Marketplace</h1>
          <div className="filter-container">
            <span className="filter-item active">All</span>
            <span className="filter-item">Abstract</span>
            <span className="filter-item">Avatar</span>
            <span className="filter-item">Games</span>
            <span className="filter-item">Memes</span>
          </div>
        </div>
        <div className="marketplace-listings">
            {[
              { image:'/cardImages/0.png', price: '1.40 ETH', title: 'Your Brain social media addiction' },
              { image:'/cardImages/1.png', price: '1.50 ETH', title: 'Land damaged by me and nature' },
              { image:'/cardImages/2.png', price: '1.32 ETH', title: 'Aurora Wave Dark Purple Magma Tone' },
              { image:'/cardImages/3.png', price: '1.86 ETH', title: "Ancient coins from China's past" },
              { image:'/cardImages/4.png', price: '1.93 ETH', title: 'Yellow sea coral preserved by me' },
              { image:'/cardImages/5.png', price: '1.40 ETH', title: 'Your Brain social media addiction' },
              { price: '1.50 ETH', title: 'Land damaged by me and nature' },
              { price: '1.32 ETH', title: 'Aurora Wave Dark Purple Magma Tone' },
              { price: '1.86 ETH', title: "Ancient coins from China's past" },
              { price: '1.93 ETH', title: 'Yellow sea coral preserved by me' },
            ].map((listing, index) => (
              <div className="marketplace-card" key={index}>
                <img src={listing.image} className="card-image-marketplace" />
                <p className="card-price">{listing.price}</p>
                <p className="card-title">{listing.title}</p>
                <button className="place-bid-btn">Place Your Bid</button>
              </div>
            ))}
          </div>
      </div>
    </>
    );
  };

export default Marketplace;
