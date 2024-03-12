import React, { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import axios from 'axios';

const DessinCanvas = () => {
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState('');

  const envoyerDessin = async () => {
    const image = canvasRef.current.getSaveData();
    try {
      const response = await axios.post('url-server', { image });
      setPrediction(response.data.prediction); 
    } catch (error) {
      console.error("Erreur lors de l'envoi du dessin", error);
      setPrediction("Erreur lors de la classification.");
    }
  };

  return (
    <div>
      <CanvasDraw ref={canvasRef} brushRadius={1} lazyRadius={0} canvasWidth={400} canvasHeight={400} />
      <button onClick={envoyerDessin}>Classifier</button>
      {prediction && <div>Résultat de la prédiction: {prediction}</div>}
    </div>
  );
};

export default DessinCanvas;
