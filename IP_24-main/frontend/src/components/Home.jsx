import React, { useState } from "react";

const GENRES = ["RPG", "Shooter", "Sandbox", "Sports", "Puzzle"];

const Home = ({ games, addToCart, goToTeam }) => {
  const [searchEntry, setSearchEntry] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  // Filter games based on search and selected genre
  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.product_name.toLowerCase().includes(searchEntry.toLowerCase());
    const matchesGenre = selectedGenre ? game.tag === selectedGenre : true;
    return matchesSearch && matchesGenre;
  });

  const carouselGames = [
    { img: "Helldivers2.jpg", name: "Helldivers 2" },
    { img: "Minecraft.jpg", name: "Minecraft" },
    { img: "OcarinaOfTime.jpg", name: "The Legend of Zelda: Ocarina of Time" },
    { img: "MonumentValley.png", name: "Monument Valley" },
    { img: "ManifoldGarden.jpg", name: "Manifold Garden" },
  ];

  return (
    <>
      {/* Carousel */}
      <div className="carousel-outer-container my-4">
        <div id="carouselExampleIndicators" className="carousel slide">
          <div className="carousel-indicators">
            {carouselGames.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {carouselGames.map((carouselGame, i) => (
              <div
                className={`carousel-item c-item ${i === 0 ? "active" : ""}`}
                key={carouselGame.img}
              >
                <img
                  src={`/images/${carouselGame.img}`}
                  className="d-block w-100 c-image"
                  alt={`Slide ${i + 1}`}
                />
                <div className="carousel-caption d-none center mt-4 d-md-block">
                  {/* Add to Cart Button */}
                  <button
                    className="btn btn-primary c-button ms-2"
                    onClick={() => {
                      const game = games.find(
                        (g) =>
                          g.product_name === carouselGame.name
                      );
                      if (game) addToCart(game);
                    }}
                  >
                    Add to Cart
                  </button>
                  <p className="!text-purple !bold">
                    {[
                      "Stand and fight for DEMOCRACY!",
                      "I've been placing blocks and stuff because I'm in Minecraft",
                      "An Ocarina is an instrument",
                      "Tell me princess, why have you returned?",
                      "If an art exhibit was a game",
                    ][i]}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Search Bar and Genre Toggles */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search games..."
          value={searchEntry}
          onChange={(e) => setSearchEntry(e.target.value)}
          className="form-control mb-3"
        />
        <div className="d-flex gap-2 flex-wrap mb-3">
          {GENRES.map((genre) => (
            <button
              key={genre}
              className={`btn ${
                selectedGenre === genre ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() =>
                setSelectedGenre(selectedGenre === genre ? "" : genre)
              }
            >
              {genre}
            </button>
          ))}
          <button
            className={`btn ${selectedGenre === "" ? "btn-secondary" : "btn-outline-secondary"}`}
            onClick={() => setSelectedGenre("")}
          >
            All Genres
          </button>
        </div>
      </div>

      {/* Game Showcase */}
      <div className="row game-container">
        {filteredGames.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">
            No games found.
          </div>
        ) : (
          filteredGames.map((game) => (
            <div className="col-12 col-lg-6 col-xxl-4 mb-4" key={game.product_id}>
              <div className="card flex-row game-card h-100">
                {/* Poster Image */}
                <div className="game-card-img-col">
                  <img
                    src={game.url}
                    alt={game.product_name}
                    className="game-card-image"
                  />
                </div>
                {/* Game Info (For larger screen sizes only) */}
                <div className="game-card-info-col d-none d-sm-flex flex-column justify-content-between p-4">
                  <div>
                    {game.tag && (
                      <span className="badge bg-primary mb-2">{game.tag}</span>
                    )}
                    <h5 className="card-title">{game.product_name}</h5>
                    {game.release_date && (
                      <div className="text-muted small mb-1">{game.release_date}</div>
                    )}
                    <div className="mb-2 fw-bold">${game.price}</div>
                    <p className="card-text">{game.description}</p>
                  </div>
                  <div>
                    <a
                      href={game.purchaseLink || game.steam_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-secondary me-2 mb-2"
                    >
                      View Game
                    </a>
                    <button
                      className="btn btn-primary mb-2"
                      onClick={() => addToCart(game)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                {/* Mobile/small screen only actions */}
                <div className="d-flex d-sm-none flex-column justify-content-center align-items-center w-100 p-3">
                  <a
                    href={game.purchaseLink || game.steam_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary mb-2 w-100"
                  >
                    View Game
                  </a>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => addToCart(game)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Section */}
      <div className="d-flex align-items-center justify-content-between p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary">
        <div className="col-lg-6">
          <h1 className="display-4 fst-italic">What Is Joystick Journeys?</h1>
          <p className="lead my-3">
            Joystick Journeys is a gaming centric company focused on creating a quality site that gamers can visit to discover a wide selection of great games to play.
          </p>
          <p className="lead mb-0">
            <button
              className="text-body-emphasis fw-bold btn btn-link p-0"
              style={{ textDecoration: "underline", background: "none", border: "none" }}
              onClick={goToTeam}
            >
              Learn more about the team...
            </button>
          </p>
        </div>
        <div className="col-lg-6 d-flex justify-content-center">
          <img
            src="/JoystickJourneysLogo.png"
            className="img-fluid"
            style={{ width: "100%", maxWidth: 400, height: "auto" }}
            alt="Joystick Journeys Logo"
          />
        </div>
      </div>
    </>
  );
};

export default Home;