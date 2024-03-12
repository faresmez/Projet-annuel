import React from 'react';
import { createRoot } from 'react-dom/client';
import DessinCanvas from './dessin/DessinCanvas';
import Badge from 'react-bootstrap/Badge';

const App = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh' 
    }}>
      <h1><Badge bg="secondary">Dessinez un chiffre et obtenez une prédiction</Badge></h1>
      <DessinCanvas />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

export default App;
