import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, FileText, Clock } from 'lucide-react';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

function Home({ activeUser }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, [activeUser]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/documents?email=${activeUser}`);
      setDocuments(res.data);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async () => {
    try {
      const res = await axios.post(`${API_URL}/documents`, {
        owner: activeUser,
        title: "Untitled Document",
      });
      navigate(`/document/${res.data._id}`);
    } catch (error) {
      console.error("Failed to create document", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Your Documents</h2>
        <button className="btn btn-primary" onClick={createDocument}>
          <Plus size={18} />
          <span>Blank Document</span>
        </button>
      </div>

      {loading ? (
        <p>Loading documents...</p>
      ) : documents.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
          <FileText size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <p>No documents yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="documents-grid">
          {documents.map((doc) => (
            <Link to={`/document/${doc._id}`} key={doc._id} className="document-card">
              <div className="document-thumbnail">
                <FileText size={40} />
              </div>
              <div className="document-info">
                <h3 className="document-title">{doc.title}</h3>
                <div className="document-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                </div>
                {doc.owner !== activeUser && (
                  <div className="document-meta" style={{ marginTop: '4px', color: 'var(--primary)' }}>
                    Shared by {doc.owner}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
