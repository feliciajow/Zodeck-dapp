import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Cardpack from './pages/Cardpack';
import Marketplace from './pages/Marketplace';
import CardpackResults from './pages/CardpackResults';
import Collection from './pages/Collection';
import ViewCard from './pages/ViewCard';
import {useState, useEffect} from 'react';
const ethers = require('ethers');

function Header() {
  
  const [provider, setProvider] = useState(null);
  const [walletConnected, setwalletConnected] = useState(null);
  const [account, setAccount] = useState(null);

  //when application refreshes
  useEffect( ()=>{
    // if metamask is available
    if (window.ethereum){
      // adding a listener
      window.ethereum.on('Changed of accounts', handleAccounts);
    }
    // once account is changed, the account listener is removed
    return() =>{
      if (window.ethereum){
        window.ethereum.removeListener('Changed of accounts', handleAccounts);
      }
    }
  });

  function handleAccounts(accounts){
    // if the new account of metamask, it should not be equal to the address stored in the account previously and its length should be more than 0
    if (accounts.length>=1 && account !== account[0]){
      setAccount(account[0]);
    }else{
      setwalletConnected(false);
      setAccount(null);
    }
  }

  
  async function connectMetamask(){
    if (window.ethereum !=null){
      try{
        //Web3Provider wraps the standard Web3 provider, MetaMask injects as window.ethereum into each page
        const provider = new ethers.providers.Web3Provider(window.ethereum); 
        //update the provider state
        setProvider(provider);
        // give all the accounts
        await provider.send("eth_requestAccounts", []); 
        //current metamask account
        const signer = provider.getSigner(); 
        //retrieve address of account, signer is the account
        const address = await signer.getAddress();
        setAccount(address);
        console.log("My address is",address);
        //when wallet is connected it will be set to true
        setwalletConnected(true); 
      }
      catch (err){
        console.error(err);
      }
    } else{
      console.error("Metamask not detected.")
    }
  }

  const location = useLocation();
  console.log(location.pathname);
  // Add routes where you want to hide the header
  const hideHeaderRoutes = ['/', '/cardpack', '/cardpackresults']; // Add routes where you want to hide the header

  if (hideHeaderRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="header">
      <img src="/logo512.png" alt="Zodeck Logo" className="logo" />
      <div className="user-info">
      {/* if wallet is connected, display the metamask wallet address */}
      {walletConnected ? (<p>Login To: {account}</p>):(<p></p>)} 
      <div className="spacing"></div>
      <button className="connectWallet" onClick={connectMetamask}>Connect Wallet</button>
      </div>
    </div>
  );
}

function App() {

  return (
    <Router>
      <div className="App">
      <Header />
        <Routes>
          {/* Route for Login Page */}
          <Route path="/" element={<Login />} />
          {/* Route for Landing Page */}
          <Route path="/landing" element={<Landing />} />
          {/* Route for Cardpack page */}
          <Route path="/cardpack" element={<Cardpack />} />
          {/* Route for Marketplace page */}
          <Route path="/marketplace" element={<Marketplace />} />
          {/* Route for Cardpack Results page */}
          <Route path="/cardpackresults" element={<CardpackResults />} />
          {/* Route for Collections page */}
          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/card/:id" element={<ViewCard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;