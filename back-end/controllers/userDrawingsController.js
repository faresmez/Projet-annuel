const Numbers = require("../models/userDrawings");
const path = require("path");

// ajt
exports.createNumber = async (req, res) => {
  try {
    console.log(req.body);
    const newNumber = new Numbers(req.body);

    await newNumber.save();
    res.status(201).json(newNumber);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la création du dessin utilisateur" });
  }
};

exports.getAllNumbers = async (req, res) => {
  try {
    const numbers = await Numbers.find();
    res.json(numbers);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des dessins utilisateurs",
    });
  }
};

// detail
exports.getNumberById = async (req, res) => {
  try {
    const numberToGet = await Numbers.findById(req.params.id);
    if (!numberToGet) {
      return res.status(404).json({ error: "Number non trouvée" });
    }
    res.json(numberToGet);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du dessin utilisateur" });
  }
};

exports.deleteNumber = async (req, res) => {
  try {
    const numberToDelete = await Numbers.findByIdAndRemove(req.params.id);
    if (!numberToDelete) {
      return res.status(404).json({ error: "Dessin utilisateur non trouvée." });
    }
    res.json({ message: "Dessin utilisateur supprimée avec succès." });
  } catch (err) {
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la suppression du dessin utilisateur.",
    });
  }
};
