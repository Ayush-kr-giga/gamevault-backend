const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GameVault API is running 🚀");
});

app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
