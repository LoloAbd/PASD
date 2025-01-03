import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { FaUserLock } from "react-icons/fa6";
import { MdOutlinePassword } from "react-icons/md";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

 const handleSubmit = (e) => {
  e.preventDefault();

  axios.post('http://localhost:3001/login', { username, password })
    .then((res) => {
      if (res.data === "Success") {
        // Initialize session and timer on login
        const expiryMinutes = 60; // 60 minutes
        const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
        const item = { value: true, expiryTime };

        localStorage.setItem('isLogin', JSON.stringify(item));
        localStorage.setItem('adminUsername', username);
        localStorage.setItem('remainingTime', 3600); // Reset to 3600 seconds

        onLogin(); // Notify App component of login
        window.location.reload(); // Refresh to reset components
      } else {
        setErrorMessage('Invalid username or password.');
      }
    })
    .catch((err) => {
      console.error(err);
      setErrorMessage('An error occurred during login.');
    });
};

  

  return (
    <div className="LoginHome">
      <div className="wrapperLogin">
        <span className="rotate-bg"></span>
        <span className="rotate-bg2"></span>
        <div className="form-box1 login">
          <h2 className="title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label>Username</label>
              <FaUserLock className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Password</label>
              <MdOutlinePassword className="icon" />
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit">Login</button>
          </form>
        </div>
        <div className="info-text login">
          <h2>Welcome Back</h2>
        </div>
      </div>
    </div>
  );
};

export default Login;
