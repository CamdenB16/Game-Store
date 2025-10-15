const axios = require("axios");

const API_KEY = "413eedc0cef44438a64e32ca1562033c";

const rawg = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: { key: API_KEY },
});

// Search for games by keyword
async function searchGames(query) {
  const res = await rawg.get("/games", { params: { search: query } });
  return res.data.results;
}

// Get random games by date and platform
async function searchGamesByDateAndPlatforms(startDate, endDate, platforms = []) {
  const res = await rawg.get("/games", {
    params: {
      dates: `${startDate},${endDate}`,
      ordering: "-rating",
      page_size: 9,
      platforms: platforms.join(","),
    },
  });
  return res.data.results;
}

module.exports = {
  searchGames,
  searchGamesByDateAndPlatforms,
};
