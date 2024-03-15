import React, { useRef, useState, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

const DessinCanvas = () => {
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      try {
        const loadedModel = await tf.loadLayersModel("http://localhost:4000/model/model.json");
        setModel(loadedModel);
      } catch (error) {
        console.error("Failed to load model", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadModel();
  }, []);

  const canvasToImageData = (canvas) => {
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const pixels = [];
  
    for (let i = 0; i < data.length; i += 4) {
      const grayscale = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
      pixels.push(grayscale);
    }
    return { pixels };
  };

  const preprocessCanvasImage = async (canvas) => {
    let tensor = tf.browser.fromPixels(canvas)
      .resizeNearestNeighbor([28, 28])
      .mean(2)
      .expandDims(2)
      .toFloat()
      .div(tf.scalar(255.0))
      .expandDims();
    return tensor;
  };

  const envoyerDessin = async () => {
    const canvas = canvasRef.current.canvasContainer.childNodes[1];
    if (!canvas || !model) return;
  
    setIsLoading(true);
    try {
      const tensorImage = await preprocessCanvasImage(canvas);
      const predictionArray = await model.predict(tensorImage).data();
      const predictedIndex = predictionArray.indexOf(Math.max(...predictionArray));
      setPrediction(`Prédiction : ${predictedIndex}`);
      const pixelJSON = canvasToImageData(canvas);
      pixelJSON['resultat'] = predictedIndex;
      const response = await axios.post("http://localhost:4000/numbers/", pixelJSON);
      console.log("Réponse du serveur :", response.data);
    } catch (error) {
      console.error("Erreur lors de la prédiction :", error);
      setPrediction("Erreur lors de la classification.");
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  };  

  const refaireDessin = () => {
    canvasRef.current.clear();
    setPrediction("");
    setIsCanvasEmpty(true);
    setShowModal(false);
  };

  useEffect(() => {
    const verifierSiCanvasEstVide = () => {
      const dataVierge = canvasRef.current.getSaveData();
      setIsCanvasEmpty(dataVierge === '{"lines":[],"width":400,"height":400}');
    };
    verifierSiCanvasEstVide();
  }, [prediction]); // Recheck whenever a prediction is made to ensure state reflects the current canvas status

  const handleClose = () => {
    setShowModal(false);
    refaireDessin();
  };

  return (
    <div className="container mt-3" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ border: "2px solid #000", padding: "10px" }}>
        <CanvasDraw
          ref={canvasRef}
          brushRadius={10}
          lazyRadius={0}
          canvasWidth={400}
          canvasHeight={400}
          onChange={() => setIsCanvasEmpty(false)}
        />
      </div>
      <div className="mt-3">
        <Button onClick={envoyerDessin} disabled={isCanvasEmpty || isLoading} variant="primary">
          {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Classifier"}
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

/* import React, { useRef, useState, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";



const DessinCanvas = () => {
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      const loadedModel = await tf.loadLayersModel("http://localhost:4000/model/model.json");
      setModel(loadedModel);
      setIsLoading(false);
    };
    loadModel();
  }, []);

  const canvasToImageData = (canvas) => {
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const pixels = [];
  
    for (let i = 0; i < data.length; i += 4) {
      const grayscale = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
      pixels.push(grayscale);
    }
    return { pixels };
  };
  
  const preprocessCanvasImage = async (canvas) => {
    let tensor = tf.browser.fromPixels(canvas)
      .resizeNearestNeighbor([28, 28])
      .mean(2)
      .expandDims(2)
      .toFloat()
      .div(tf.scalar(255.0))
      .expandDims();
    return tensor;
  };

  const envoyerDessin = async () => {
    const canvas = canvasRef.current.canvasContainer.childNodes[1];
    if (!canvas || !model) return;

    setIsLoading(true);
    try {
      const tensorImage = await preprocessCanvasImage(canvas);
      const predictionArray = await model.predict(tensorImage).data();
      const predictedIndex = predictionArray.indexOf(Math.max(...predictionArray));
      setPrediction(`Prédiction : ${predictedIndex}`);
      const pixelJSON = canvasToImageData(canvas);
      pixelJSON['resultat']= predictedIndex
      const response = await axios.post(
        "http://localhost:4000/numbers/",
        pixelJSON
      );
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Erreur lors de la prédiction", error);
      setPrediction("Erreur lors de la classification.");
    } finally {
      setShowModal(true);
      setIsLoading(false);
    }

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
    <div className="container mt-3" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ border: "2px solid #000", padding: "10px" }}>
        <CanvasDraw
          ref={canvasRef}
          brushRadius={10}
          lazyRadius={0}
          canvasWidth={400}
          canvasHeight={400}
          onChange={verifierSiCanvasEstVide}
        />
      </div>
      <div className="mt-3">
        <Button onClick={envoyerDessin} disabled={isCanvasEmpty || isLoading} variant="primary">
          {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Classifier"}
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