const express = require("express");
const router = express.Router();
const userDrawingsController = require("../controllers/userDrawingsController");

router.post("/", userDrawingsController.createNumber);
router.get("/get", userDrawingsController.getAllNumbers);
router.get("/:id", userDrawingsController.getNumberById);
router.delete("/:id", userDrawingsController.deleteNumber);

module.exports = router;
