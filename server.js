require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cors = require("cors");
const colors = require("colors");

require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());

// Import Routes
const userRoutes = require("./routes/user.routes");
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.json("Bienvenue sur My-Social-Network-API");
});

app.get("*", (req, res) => {
  res.status(404).json("Page introuvable");
});

// Server
app.listen(process.env.PORT, () => {
  console.log(colors.america(`server OK on ${process.env.PORT}`));
});
