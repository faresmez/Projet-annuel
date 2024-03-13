import React, { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const DessinCanvas = () => {
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState('');
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const canvasImageToJSON = (canvas) => {
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const pixelJSON = {};
    for (let i = 0; i < pixels.length; i += 4) {
      const pixelNum = i / 4;
      const grayscaleValue = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      pixelJSON[`pixel${pixelNum}`] = grayscaleValue;
    }

    return pixelJSON;
  };

  const envoyerDessin = async () => {
    const canvas = canvasRef.current.canvasContainer.childNodes[0];
    const pixelJSON = canvasImageToJSON(canvas);

    try {
      const response = await axios.post('url-server', { image: pixelJSON });
      setPrediction(response.data.prediction);
      setShowModal(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi du dessin", error);
      setPrediction("Erreur lors de la classification.");
      setShowModal(true);
    }
  };

  const refaireDessin = () => {
    canvasRef.current.clear();
    setPrediction('');
    setIsCanvasEmpty(true);
    setShowModal(false);
  };

  const verifierSiCanvasEstVide = () => {
    const dataVierge = canvasRef.current.getSaveData();
    setIsCanvasEmpty(dataVierge === '{"lines":[],"width":400,"height":400}');
  };

  const handleClose = () => {
    setShowModal(false);
    refaireDessin();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'}} className="container mt-3">
      <div style={{ border: '2px solid #000', padding: '10px', }}>
        <CanvasDraw 
          ref={canvasRef} 
          brushRadius={1} 
          lazyRadius={0} 
          canvasWidth={400} 
          canvasHeight={400} 
          onChange={verifierSiCanvasEstVide}
        />
      </div>
      <div className="mt-3">
        <Button onClick={envoyerDessin} disabled={isCanvasEmpty} variant="primary">Classifier</Button>
        {' '}
        <Button onClick={refaireDessin} variant="secondary">Refaire</Button>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton><Modal.Title>Résultat de la prédiction</Modal.Title></Modal.Header>
        <Modal.Body>{prediction}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DessinCanvas;






/*     const  envoyerDessin = async () => {
    const image = canvasRef.current.getSaveData();
    try {
      const response = await axios.post('url-server', { image });
      setPrediction(response.data.prediction);
      setShowModal(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi du dessin", error);
      setPrediction("Erreur lors de la classification.");
      setShowModal(true);
    }
  }; */ 

/*     const getPixelData = (canvas) => {
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    return imageData.data;
  }; 
    const envoyerDessin = async () => {
    const canvas = canvasRef.current.canvasContainer.childNodes[1];
    const pixelData = getPixelData(canvas);

    const pixelJSON = {};
      for (let i = 0; i < pixelData.length; i += 4) {
        const pixelNum = i / 4;
        const grayscaleValue = (pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 3;
        pixelJSON[`pixel${pixelNum}`] = grayscaleValue;
      }

      try {
        const response = await axios.post('url-server', { image: pixelJSON });
        setPrediction(response.data.prediction);
        setShowModal(true);
      } catch (error) {
        console.error("Erreur lors de l'envoi du dessin", error);
        setPrediction("Erreur lors de la classification.");
        setShowModal(true);
      }
  };  */