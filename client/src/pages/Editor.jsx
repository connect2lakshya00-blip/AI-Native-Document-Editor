import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Share, Sparkles, ArrowLeft, Upload } from 'lucide-react';
import ShareModal from '../components/ShareModal';
import AIModal from '../components/AIModal';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

function Editor({ activeUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  
  const [status, setStatus] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocument();
  }, [id, activeUser]);

  const fetchDocument = async () => {
    try {
      const res = await axios.get(`${API_URL}/documents/${id}`);
      setDocument(res.data);
      setContent(res.data.content);
      setTitle(res.data.title);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load document", error);
      setStatus('Failed to load document');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setStatus('Saving...');
    try {
      await axios.put(`${API_URL}/documents/${id}`, {
        title,
        content,
        userEmail: activeUser
      });
      setStatus('All changes saved');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      if (error.response?.status === 403) {
        setStatus('You do not have permission to edit this document.');
      } else {
        setStatus('Failed to save');
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setStatus('Uploading...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const importedContent = `<p><br></p><p><strong>imported from ${res.data.filename}:</strong></p><p>${res.data.content.replace(/\n/g, '<br/>')}</p>`;
      
      setContent(prev => prev + importedContent);
      setStatus('File imported successfully');
    } catch (error) {
      console.error("Upload failed", error);
      setStatus('File import failed (only .txt or .md)');
    }
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading editor...</div>;

  // Determine permissions
  const isOwner = document?.owner === activeUser;
  const isEditorRole = document?.sharedWith?.some(u => u.email === activeUser && u.role === 'editor');
  const canEdit = isOwner || isEditorRole;

  return (
    <div className="editor-container">
      <div className="editor-toolbar-custom">
        <button className="btn-icon" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
        </button>
        
        <input 
          className="doc-title-input" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          disabled={!canEdit}
          placeholder="Document Title"
        />
        
        <span className="status-text" style={{ marginLeft: '1rem', flex: 1 }}>{status}</span>

        {canEdit && (
          <>
            <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()} title="Import .txt or .md">
              <Upload size={16} /> Attach File
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".txt,.md" 
              onChange={handleFileUpload}
            />

            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={16} /> Save
            </button>
          </>
        )}

        {isOwner && (
          <button className="btn btn-outline" onClick={() => setShowShareModal(true)}>
            <Share size={16} /> Share
          </button>
        )}

        <button className="btn btn-outline" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }} onClick={() => setShowAIModal(true)}>
          <Sparkles size={16} /> AI Summarize
        </button>
      </div>

      <div className="quill-wrapper">
        <ReactQuill 
          theme="snow" 
          value={content} 
          onChange={setContent} 
          readOnly={!canEdit}
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              ['clean']
            ]
          }}
        />
      </div>

      {showShareModal && (
        <ShareModal 
          documentId={id} 
          ownerEmail={activeUser}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showAIModal && (
        <AIModal 
          content={content} 
          onClose={() => setShowAIModal(false)}
        />
      )}
    </div>
  );
}

export default Editor;
