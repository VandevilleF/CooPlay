import axios from "axios";
import { prisma } from "./src/shared/prismaClient.js";

const API_KEY = "d50f6b7a86d148799c007f28320a5336";

async function fetchAndStoreGames() {
  try {
    // 1. Appel à l’API RAWG
    const response = await axios.get("https://api.rawg.io/api/games", {
      params: {
        key: API_KEY,
        platforms: 4,
        tags: "multiplayer,co-op,online-co-op",
        page_size: 20,
      },
    });

    const games = response.data.results;

    console.log("=== Jeux récupérés ===");

    // 2. Insertion en base
    for (const g of games) {
      const game = await prisma.game.upsert({
        where: { rawg_id: g.id },
        update: {
          name: g.name,
          cover_url: g.background_image,
          released: g.released ? new Date(g.released) : null,
        },
        create: {
          rawg_id: g.id,
          name: g.name,
          cover_url: g.background_image,
          released: g.released ? new Date(g.released) : null,
        },
      });

      console.log(`✅ Sauvegardé : ${game.name}`);
    }
  } catch (error) {
    console.error("❌ Erreur API RAWG :", error.response?.data || error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fetchAndStoreGames();
