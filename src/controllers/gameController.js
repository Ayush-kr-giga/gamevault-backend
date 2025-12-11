const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// controllers/gameController.js (replace addGame)
const addGame = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { gameId, title, genre, platform, releaseYear, status, rating } = req.body;

    let game;

    // 1) If frontend sends gameId (adding a global game to user's library)
    if (gameId) {
      game = await prisma.game.findUnique({ where: { id: Number(gameId) } });
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      // prevent duplicates (userId + gameId unique)
      const already = await prisma.userGame.findFirst({
        where: { userId, gameId: game.id }
      });
      if (already) {
        return res.status(400).json({ message: "Game already in your library" });
      }

      const userGame = await prisma.userGame.create({
        data: {
          userId,
          gameId: game.id,
          status: status || "Not Started",
          rating: rating ?? null
        }
      });

      return res.json({ message: "Game added to your library", game, userGame });
    }

    // 2) Old behavior: create/find by title + platform (manual add)
    if (!title || !platform) {
      return res.status(400).json({ message: "Provide title and platform or gameId" });
    }

    game = await prisma.game.findFirst({
      where: { title, platform }
    });

    if (!game) {
      game = await prisma.game.create({
        data: { title, genre, platform, releaseYear }
      });
    }

    const userGame = await prisma.userGame.create({
      data: {
        userId,
        gameId: game.id,
        status: status || "Not Started",
        rating: rating ?? null
      }
    });

    res.json({ message: "Game added to your library", game, userGame });

  } catch (error) {
    res.status(500).json({ error: "Failed to add game", details: error.message });
  }
};


const getAllGames = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const whereConditions = {
      title: {
        contains: search
      }
    };

    const games = await prisma.game.findMany({
      where: whereConditions,
      skip,
      take: limit
    });

    const totalItems = await prisma.game.count({
      where: whereConditions
    });

    res.json({
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      data: games
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getUserGames = async (req, res) => {
  try {
    const userId = req.user.userId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const games = await prisma.userGame.findMany({
      where: { userId },
      include: { game: true },
      skip,
      take: limit
    });

    const totalItems = await prisma.userGame.count({
      where: { userId }
    });

    const formatted = games.map((g) => ({
      userGameId: g.id,
      status: g.status,
      rating: g.rating,
      addedAt: g.addedAt,
      ...g.game
    }));

    res.json({
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      data: formatted
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const updateGame = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { status, rating } = req.body;


    const userGame = await prisma.userGame.findUnique({
      where: { id: Number(id) }
    });

    if (!userGame) {
      return res.status(404).json({ message: "Game entry not found" });
    }

    if (userGame.userId !== userId) {
      return res.status(403).json({ message: "You cannot modify another user's game" });
    }

    const updated = await prisma.userGame.update({
      where: { id: Number(id) },
      data: { status, rating }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteGame = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;


    const userGame = await prisma.userGame.findUnique({
      where: { id: Number(id) }
    });

    if (!userGame) {
      return res.status(404).json({ message: "Game entry not found" });
    }

    if (userGame.userId !== userId) {
      return res.status(403).json({ message: "You cannot delete another user's game" });
    }


    await prisma.userGame.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Game removed from your library" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { addGame, getAllGames, updateGame, deleteGame, getUserGames }
