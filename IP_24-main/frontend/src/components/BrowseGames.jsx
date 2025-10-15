import React, { useState, useEffect } from "react";
import axios from "axios";

const BrowseGames = ({ cart, setCart, onBack }) => {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [allGenres, setAllGenres] = useState([]);

  const generateRandomPrice = () => {
    const price = (Math.random() * 100).toFixed(0);
    return `$${price}.99`;
  };

  const getPriceForGame = (gameId) => {
    const storedPrices = JSON.parse(sessionStorage.getItem("gamePrices")) || {};
    if (!storedPrices[gameId]) {
      const newPrice = generateRandomPrice();
      storedPrices[gameId] = newPrice;
      sessionStorage.setItem("gamePrices", JSON.stringify(storedPrices));
    }
    return storedPrices[gameId];
  };

  const extractGenres = (gamesList) => {
    const genreSet = new Set();
    gamesList.forEach(game => {
      game.genre?.split(", ").forEach(g => genreSet.add(g.trim()));
    });
    return ["All", ...Array.from(genreSet)];
  };

  const fetchAndSetGames = async (url) => {
    try {
      const res = await axios.get(url);
      const gamesWithPrices = res.data.map(game => ({
        ...game,
        price: getPriceForGame(game.id),
      }));
      setGames(gamesWithPrices);
      setAllGenres(extractGenres(gamesWithPrices));
    } catch (err) {
      console.error("Failed to fetch games:", err);
    }
  };

  useEffect(() => {
    fetchAndSetGames("http://localhost:8080/api/randomGames");
  }, []);

  const handleSearch = async () => {
    await fetchAndSetGames(`http://localhost:8080/api/searchGame?query=${query}`);
  };

  const addToCart = (game) => {
    const numericPrice = parseFloat(game.price.replace("$", ""));
    const product = {
      product_id: game.id,
      product_name: game.title,
      price: numericPrice,
    };
    setCart((prevCart) => {
      if (prevCart.find((item) => item.product_id === product.product_id)) return prevCart;
      return [...prevCart, product];
    });
  };

  const filteredGames = selectedGenre === "All" ? games : games.filter(game => game.genre?.split(", ").includes(selectedGenre));

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-white">Browse Games</h1>
        <button
          onClick={() => onBack("cart")}
          className="bg-white text-black px-4 py-2 rounded hover:bg-blue-200">
          Go to Cart ({cart.length})
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search for a game..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white placeholder-white"/>
        <button
          onClick={handleSearch}
          className="bg-white text-black px-4 py-2 rounded hover:bg-blue-700">
    
          Search
        </button>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700">
          {allGenres.map((genre) => (
            <option key={genre}>{genre}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row h-full">
            {/* Game image */}
            <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
              <img
                src={game.image || "https://dummyimage.com/300x200/000/fff&text=No+Image"}
                alt={game.title}
                className="object-cover w-full h-full"/>
            </div>

            {/* Game details */}
            <div className="p-4 flex flex-col justify-between w-full md:w-2/3">
              <div>
                {game.genre && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {game.genre.split(", ").map((g) => (
                      <span
                        key={g}
                        className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {g}
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{game.title}</h3>
                <p className="text-gray-600 text-sm mb-1">Released: {game.releaseDate}</p>
                <p className="text-gray-600 text-sm mb-1">Rating: {game.rating}</p>
                <p className="text-gray-700 text-base font-semibold mt-2">{game.price}</p>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                  onClick={() => addToCart(game)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseGames;