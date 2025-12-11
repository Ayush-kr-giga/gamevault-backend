const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  const games = [
    { title: "Elden Ring", genre: "RPG", platform: "PC", releaseYear: 2022 },
    { title: "God of War", genre: "Action", platform: "PlayStation", releaseYear: 2018 },
    { title: "Minecraft", genre: "Sandbox", platform: "PC", releaseYear: 2011 },
    { title: "The Witcher 3", genre: "RPG", platform: "PC", releaseYear: 2015 },
    { title: "GTA V", genre: "Action", platform: "PC", releaseYear: 2013 },
    { title: "Valorant", genre: "FPS", platform: "PC", releaseYear: 2020 },
    { title: "Cyberpunk 2077", genre: "RPG", platform: "PC", releaseYear: 2020 },
    { title: "FIFA 23", genre: "Sports", platform: "PC", releaseYear: 2022 },
    { title: "Call of Duty: Warzone", genre: "FPS", platform: "PC", releaseYear: 2020 },
    { title: "Horizon Zero Dawn", genre: "Action", platform: "PC", releaseYear: 2017 },
    { title: "Assassin's Creed Valhalla", genre: "Action", platform: "PC", releaseYear: 2020 },
    { title: "Red Dead Redemption 2", genre: "Action", platform: "PC", releaseYear: 2018 },
    { title: "The Legend of Zelda: Breath of the Wild", genre: "Adventure", platform: "Switch", releaseYear: 2017 },
    { title: "Super Mario Odyssey", genre: "Platformer", platform: "Switch", releaseYear: 2017 },
    { title: "League of Legends", genre: "MOBA", platform: "PC", releaseYear: 2009 },
    { title: "Dota 2", genre: "MOBA", platform: "PC", releaseYear: 2013 },
    { title: "Overwatch", genre: "FPS", platform: "PC", releaseYear: 2016 },
    { title: "Fortnite", genre: "Battle Royale", platform: "PC", releaseYear: 2017 },
    { title: "Among Us", genre: "Party", platform: "PC", releaseYear: 2018 },
    { title: "Animal Crossing: New Horizons", genre: "Simulation", platform: "Switch", releaseYear: 2020 },
    { title: "Hades", genre: "Roguelike", platform: "PC", releaseYear: 2020 },
    { title: "Dead Cells", genre: "Roguelike", platform: "PC", releaseYear: 2018 },
    { title: "Stardew Valley", genre: "Simulation", platform: "PC", releaseYear: 2016 },
    { title: "Rocket League", genre: "Sports", platform: "PC", releaseYear: 2015 },
    { title: "The Sims 4", genre: "Simulation", platform: "PC", releaseYear: 2014 },
    { title: "Resident Evil Village", genre: "Horror", platform: "PC", releaseYear: 2021 },
    { title: "Far Cry 6", genre: "Action", platform: "PC", releaseYear: 2021 },
    { title: "Monster Hunter: World", genre: "Action", platform: "PC", releaseYear: 2018 },
    { title: "Sekiro: Shadows Die Twice", genre: "Action", platform: "PC", releaseYear: 2019 },
    { title: "Dark Souls III", genre: "RPG", platform: "PC", releaseYear: 2016 },
    { title: "Fall Guys", genre: "Party", platform: "PC", releaseYear: 2020 },
    { title: "Ghost of Tsushima", genre: "Action", platform: "PlayStation", releaseYear: 2020 },
    { title: "Cuphead", genre: "Platformer", platform: "PC", releaseYear: 2017 }
  ];

  for (const game of games) {

    const exists = await prisma.game.findFirst({
      where: {
        title: game.title,
        platform: game.platform
      }
    });

    if (!exists) {
      await prisma.game.create({
        data: game
      });
    }
  }

  console.log("Seed data inserted successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
