const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { registerUser, getAllUsers } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.get("/", getAllUsers);
router.get("/me", auth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  res.json({ username: user.username });
});


module.exports = router;
