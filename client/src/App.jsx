import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor';
import { UserCircle } from 'lucide-react';
import './index.css';

// Mock active user mechanism
const MOCK_USER_EMAILS = ["test@example.com", "jane@example.com"];

function App() {
  const [activeUser, setActiveUser] = useState(MOCK_USER_EMAILS[0]);

  // A simple header to show who is logged in globally
  const renderNavbar = () => (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="navbar-title">AI Docs</a>
      </div>
      <div className="navbar-user">
        <UserCircle size={20} />
        <select 
          value={activeUser} 
          onChange={(e) => setActiveUser(e.target.value)}
          style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          {MOCK_USER_EMAILS.map(email => (
            <option key={email} value={email}>{email}</option>
          ))}
        </select>
      </div>
    </nav>
  );

  return (
    <BrowserRouter>
      <div className="app-container">
        {renderNavbar()}
        <Routes>
          <Route path="/" element={<Home activeUser={activeUser} />} />
          <Route path="/document/:id" element={<Editor activeUser={activeUser} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
