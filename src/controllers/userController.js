const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await prisma.user.create({
      data: { username, email, password },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, getAllUsers };
