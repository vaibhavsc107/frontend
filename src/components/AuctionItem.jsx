import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AuctionItem() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bid, setBid] = useState(0);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin'); // Redirect if not authenticated
      return;
    }

    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/auctions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItem(res.data);
        setBid(res.data.currentBid + 1); // Set bid input to be one above current bid
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error fetching auction item.');
        console.error(error);
      }
    };

    fetchItem();
  }, [id, navigate]);

  const handleBid = async () => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      setMessage("You must be logged in to place a bid.");
      navigate("/signin");
      return;
    }
  
    console.log("Token being sent:", token); // Debugging
  
    if (bid <= item.currentBid) {
      setMessage("Bid must be higher than the current bid.");
      return;
    }
  
    try {
      const res = await axios.post(
        `http://localhost:5001/bid/${id}`,
        { bid: Number(bid) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Server Response:", res.data); // Debugging
  
      setMessage(res.data.message);
      if (res.data.winner) {
        setMessage(`Auction closed. Winner: ${res.data.winner}`);
      }
  
      // Refresh auction item after bid
      setItem((prev) => ({ ...prev, currentBid: Number(bid) }));
    } catch (error) {
      console.error("Bid Error:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Error placing bid.");
    }
  };
  

  if (!item) return <p>Loading auction details...</p>;

  return (
    <div>
      <h2>{item.itemName}</h2>
      <p>{item.description}</p>
      <p>Current Bid: ${item.currentBid}</p>
      <p>Highest Bidder: {item.highestBidder || 'No bids yet'}</p>

      {!item.isClosed ? (
        <>
          <input
            type="number"
            value={bid}
            onChange={(e) => setBid(Number(e.target.value))}
            min={item.currentBid + 1}
            placeholder="Enter your bid"
          />
          <button onClick={handleBid}>Place Bid</button>
        </>
      ) : (
        <p style={{ color: 'red' }}>Auction is closed.</p>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AuctionItem;
