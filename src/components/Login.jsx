import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post("http://localhost:5001/login", { email, password });

      if (res.data.token) {
        localStorage.setItem('authToken', res.data.token);
        window.dispatchEvent(new Event("storage")); // Trigger updateAuthStatus

        navigate('/home'); // Redirect to dashboard
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login Request Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="form-container">
      {<h2>Login</h2>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignin}>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          minLength="6"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;


