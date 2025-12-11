const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    res.status(201).json({ message: "User created successfully", user });

  } catch (error) {
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
});


router.post("/login", async (req, res) => {


  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }


    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

module.exports = router;
