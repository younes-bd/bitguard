import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlaceholderPage = ({ title = 'Module', subtitle }) => {
  const navigate = useNavigate();
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: '16px',
      color: '#94a3b8', textAlign: 'center', padding: '32px'
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(99,102,241,0.1)', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <Construction size={40} color="#6366f1" />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
        {title}
      </h2>
      <p style={{ fontSize: 15, maxWidth: 400, margin: 0 }}>
        {subtitle || `The "${title}" section is being built. Full functionality coming soon.`}
      </p>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 8,
          padding: '10px 20px', borderRadius: 8, border: '1px solid #334155',
          background: 'transparent', color: '#94a3b8', cursor: 'pointer',
          fontSize: 14
        }}
      >
        <ArrowLeft size={16} /> Go Back
      </button>
    </div>
  );
};

export default PlaceholderPage;
