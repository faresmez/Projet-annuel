import React from 'react';
import { createRoot } from 'react-dom/client';
import DessinCanvas from './dessin/DessinCanvas';

const App = () => {
  return (
    <div>
      <h1>Dessinez un chiffre et obtenez une prédiction</h1>
      <DessinCanvas />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

export default App;
