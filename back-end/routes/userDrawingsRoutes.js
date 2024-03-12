const express = require("express");
const router = express.Router();
const userDrawingsController = require("../controllers/userDrawingsController");

// Créer une number
router.post("/", userDrawingsController.createNumber);
router.get("/get", userDrawingsController.getAllNumbers);

// Obtenir les détails d'une number par son ID
router.get("/:id", userDrawingsController.getNumberById);

module.exports = router;
