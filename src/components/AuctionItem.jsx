import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AuctionItem() {
    const { id } = useParams();
    const [item, setItem] = useState({});
    const [bid, setBid] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/auctions/${id}`);
                setItem(res.data);
            } catch (error) {
                setMessage('Error fetching auction item: ' + (error.response?.data?.message || error.message));
                console.error(error);
            }
        };

        fetchItem();
    }, [id]);

    const handleBid = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('You must be logged in to place a bid.');
            return;
        }

        if (bid <= item.currentBid) {
            setMessage('Bid must be higher than the current bid.');
            return;
        }

        try {
            const res = await axios.post(
                `http://localhost:5001/auctions/${id}/bid`,
                { bid },
                { headers: { Authorization: `Bearer ${token}` } } // Include token
            );

            setMessage(res.data.message);
            setItem((prev) => ({ ...prev, currentBid: bid, highestBidder: 'You' })); // Optimistic UI update
        } catch (error) {
            setMessage('Error placing bid: ' + (error.response?.data?.message || error.message));
            console.error(error);
        }
    };

    return (
        <div>
            <h2>{item.itemName}</h2>
            <p>{item.description}</p>
            <p>Current Bid: ${item.currentBid}</p>
            <p>Highest Bidder: {item.highestBidder || 'No bids yet'}</p>
            <p>Closing Time: {new Date(item.closingTime).toLocaleString()}</p>

            {item.isClosed ? (
                <p style={{ color: 'red' }}>This auction is closed.</p>
            ) : (
                <>
                    <input
                        type="number"
                        value={bid}
                        onChange={(e) => setBid(Number(e.target.value))}
                        placeholder="Enter your bid"
                        min={item.currentBid + 1}
                    />
                    <button onClick={handleBid} disabled={bid <= item.currentBid}>Place Bid</button>
                </>
            )}
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default AuctionItem;
