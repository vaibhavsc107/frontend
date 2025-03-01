import React, { useState } from "react";

const PostAuction = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized: Please log in");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/auction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Include Token Here
        },
        body: JSON.stringify({ itemName, description, startingBid, closingTime }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to post auction");

      alert("Auction Posted Successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{  margin: "20px 35.25% 0% 35.25%"}}>
      <h2>Post an Auction</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>

        <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required />

        <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required />

        <input
        type="number"
        placeholder="Starting Bid"
        value={startingBid}
        onChange={(e) => setStartingBid(e.target.value)}
        required />

        <input
        type="datetime-local"
        value={closingTime}
        onChange={(e) => setClosingTime(e.target.value)}
        required />
        <button type="submit">Post Auction</button>
      </form>
    </div>
  );
};

export default PostAuction;
