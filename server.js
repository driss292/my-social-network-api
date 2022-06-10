require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const colors = require("colors");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

// Database
require("./config/db");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Middleware
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

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
