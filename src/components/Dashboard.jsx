import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      nav('/login'); // Redirect to login if not authenticated
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/auctions`);
        setItems(res.data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };

    fetchItems();
  }, [nav]);

  return (
    <div>
      <h2>Auction Dashboard</h2>

      <Link to="/post-auction">
        <button>Post New Auction</button>
      </Link>

      <ul>
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item._id}>
              <Link to={`/auction/${item._id}`}>
                {item.itemName} - Current Bid: ${item.currentBid ?? '0.00'} {item.isClosed ? '(Closed)' : ''}
              </Link>
            </li>
          ))
        ) : (
          <p>No auctions available.</p>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
