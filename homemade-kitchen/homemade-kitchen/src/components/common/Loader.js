// src/components/common/Loader.js
import React from 'react';

const Loader = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #FF6B35;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;