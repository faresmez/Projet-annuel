import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import * as tf from "@tensorflow/tfjs";

const DessinCanvas = () => {
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState("");
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const preprocessCanvasImage = async (canvas) => {
    const tensor = tf.browser.fromPixels(canvas)
      .resizeBilinear([28, 28]) // Redimensionnement à 28x28 pixels
      .mean(2) // Conversion en niveaux de gris en faisant la moyenne sur les canaux RGB
      .expandDims(2) // Ajout d'une dimension pour les canaux (devenant en niveaux de gris)
      .expandDims() // Ajout d'une dimension pour le batch
      .toFloat() // S'assurer que les données sont en float
      .div(tf.scalar(255.0)); // Normalisation des pixels
    
    return tensor;
  };

  const envoyerDessin = async () => {
    const canvas = canvasRef.current.canvasContainer.childNodes[1];
    if (!canvas) return;
    const tensorImage = await preprocessCanvasImage(canvas);
    console.log(tensorImage.shape)
    const model = await tf.loadLayersModel("http://localhost:4000/model/model.json");

    const prediction = model.predict(tensorImage);
    const predictedIndex = prediction.argMax(1).dataSync()[0];

    setPrediction(`Prédiction : ${predictedIndex}`);
    setShowModal(true);
  };

  const refaireDessin = () => {
    canvasRef.current.clear();
    setPrediction("");
    setIsCanvasEmpty(true);
    setShowModal(false);
  };

  const verifierSiCanvasEstVide = () => {
    const dataVierge = canvasRef.current.getSaveData();
    setIsCanvasEmpty(dataVierge === '{"lines":[],"width":400,"height":400}');
  };

  const handleClose = () => setShowModal(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
      className="container mt-3">
      <div style={{ border: "2px solid #000", padding: "10px" }}>
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
        <Button
          onClick={envoyerDessin}
          disabled={isCanvasEmpty}
          variant="primary">
          Classifier
        </Button>{" "}
        <Button onClick={refaireDessin} variant="secondary">
          Refaire
        </Button>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Résultat de la prédiction</Modal.Title>
        </Modal.Header>
        <Modal.Body>{prediction}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DessinCanvas;


/* import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import * as tf from "@tensorflow/tfjs";

const DessinCanvas = () => {
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState("");
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [showModal, setShowModal] = useState(false);
  let image;

  const canvasImageToJSON = (canvas) => {
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    image = imageData;
    console.log(canvas);

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
    const model = await tf.loadLayersModel(
      "http://localhost:4000/model/model.json"
    );
    console.log(model);
    const resizedImage = tf.image.resizeBilinear(
      tf.browser.fromPixels(image),
      [28, 28]
    );
    const grayscaleImage = resizedImage.mean(2).expandDims(-1);
    const output = model.predict(grayscaleImage.reshape([1, 28, 28, 1]));
    const result = output.dataSync();
    console.log(result);
    console.log(pixelJSON);
    //pixelJSON["result"] = output;

    try {
      const response = await axios.post(
        "http://localhost:4000/numbers/",
        pixelJSON
      );
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
    setPrediction("");
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
      className="container mt-3">
      <div style={{ border: "2px solid #000", padding: "10px" }}>
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
        <Button
          onClick={envoyerDessin}
          disabled={isCanvasEmpty}
          variant="primary">
          Classifier
        </Button>{" "}
        <Button onClick={refaireDessin} variant="secondary">
          Refaire
        </Button>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Résultat de la prédiction</Modal.Title>
        </Modal.Header>
        <Modal.Body>{prediction}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DessinCanvas;
 */