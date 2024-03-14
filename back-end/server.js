require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// route imports
const numbersRoutes = require("./routes/userDrawingsRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(
  express.urlencoded({ extended: true, limit: "10mb", parameterLimit: 50000 })
);
//app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/numbers", numbersRoutes);
app.use("/model", express.static("trained_model_js_2"));

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
