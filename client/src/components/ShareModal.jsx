import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

function ShareModal({ documentId, ownerEmail, onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [status, setStatus] = useState('');
  
  const handleShare = async () => {
    setStatus('Sharing...');
    try {
      await axios.post(`${API_URL}/documents/${documentId}/share`, {
        ownerEmail,
        shareEmail: email,
        role
      });
      setStatus('Document shared successfully!');
      setTimeout(onClose, 1500);
    } catch (error) {
      console.error(error);
      setStatus('Failed to share document. Only owners can share.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Share Document</h3>
          <button className="btn-icon" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              className="input" 
              placeholder="e.g., collaborator@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Permission</label>
            <select 
              className="input" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          {status && <p className="status-text">{status}</p>}
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleShare}>Share</button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
