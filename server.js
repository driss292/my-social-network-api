require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cors = require("cors");
const colors = require("colors");

// Connexion à la DB
require("./config/db");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Bienvenue sur My-Social-Network-API");
});

app.listen(process.env.PORT, () => {
  console.log(colors.america(`server OK on ${process.env.PORT}`));
});
