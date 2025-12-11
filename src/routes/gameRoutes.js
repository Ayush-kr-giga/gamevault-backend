const express = require("express");
const { addGame, getAllGames ,updateGame,deleteGame,getUserGames} = require("../controllers/gameController.js");
const router = express.Router();

const auth = require("../middleware/authMiddleware");


router.post("/add", auth, addGame);
router.get("/", getAllGames);
router.get("/dashboard", auth, getUserGames);

router.put("/:id", auth, updateGame);     
router.delete("/:id", auth, deleteGame);  


module.exports = router;
