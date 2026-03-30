import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles } from 'lucide-react';

const API_URL = 'http://localhost:5000';

function AIModal({ content, onClose }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    generateSummary();
  }, [content]);

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/ai/summarize`, {
        text: content
      });
      setSummary(res.data.summary);
    } catch (err) {
      setError('Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
            <Sparkles size={20} /> AI Summary
          </h3>
          <button className="btn-icon" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Generating summary...
            </div>
          ) : error ? (
            <div style={{ color: 'var(--danger)' }}>{error}</div>
          ) : summary ? (
            <div style={{ 
              backgroundColor: 'var(--toolbar-bg)', 
              padding: '1rem', 
              borderRadius: '8px',
              border: '1px solid var(--border-light)'
            }}>
              {summary.split('\\n').map((line, i) => <p key={i} style={{ marginBottom: '1rem' }}>{line}</p>)}
            </div>
          ) : (
            <div>Not enough context to summarize.</div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={generateSummary} disabled={loading}>
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIModal;
