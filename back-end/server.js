require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const numbersRoutes = require("./routes/userDrawingsRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({ extended: true, limit: "10mb", parameterLimit: 800 })
);
//app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/numbers", numbersRoutes);
app.use("/model", express.static("trained_model_js_2"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected to DB & listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
