const Numbers = require("../models/userDrawings");

// ajt
exports.createNumber = async (req, res) => {
  try {
    const newNumber = new Numbers(req.body);
    console.log(req.body);
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
    res
      .status(500)
      .json({
        error: "Erreur lors de la récupération des dessins utilisateurs",
      });
  }
};

// detail
exports.getNumberById = async (req, res) => {
  try {
    const Number = await Numbers.findById(req.params.id);
    if (!Number) {
      return res.status(404).json({ error: "Number non trouvée" });
    }
    res.json(Number);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du dessin utilisateur" });
  }
};
