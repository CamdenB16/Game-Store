const express = require("express");
const cors = require("cors");
const rawg = require("./rawg");
const { connectToDb, getDb } = require("./db");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const { ObjectId } = require('mongodb');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

let db;

connectToDb().then(() => {
  db = getDb();

  // Get random games
  app.get("/api/randomGames", async (req, res) => {
    try {
      const today = new Date();
      const lastYear = new Date();
      lastYear.setFullYear(today.getFullYear() - 1);

      const startDate = lastYear.toISOString().split("T")[0];
      const endDate = today.toISOString().split("T")[0];
      const platforms = [1, 18, 4]; // PC, PS4, Xbox One

      const games = await rawg.searchGamesByDateAndPlatforms(startDate, endDate, platforms);

      // Format games for frontend
      const formattedGames = games.map(game => ({
        id: game.id,
        title: game.name,
        genre: game.genres?.map(g => g.name).join(", ") || "Unknown",
        rating: game.rating,
        releaseDate: game.released,
        image: game.background_image || "",
      }));

      res.status(200).json(formattedGames);
    } catch (err) {
      console.error("Failed to fetch random games:", err);
      res.status(500).send("Error fetching random games");
    }
  });

  // Search for specific games
  app.get("/api/searchGame", async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).send("Missing search query");

    try {
      const results = await rawg.searchGames(query);

      for (const game of results) {
        const existing = await db.collection("games").findOne({ id: game.id });

        if (!existing) {
          const newGame = {
            id: game.id,
            title: game.name,
            genre: game.genres?.map(g => g.name).join(", ") || "Unknown",
            rating: game.rating,
            releaseDate: game.released,
            image: game.background_image || "",
          };
          await db.collection("games").insertOne(newGame);
        }
      }

      // Send back results
      const enrichedResults = results.map(game => ({
        id: game.id,
        title: game.name,
        genre: game.genres?.map(g => g.name).join(", ") || "Unknown",
        rating: game.rating,
        releaseDate: game.released,
        image: game.background_image || "",
      }));

      res.status(200).json(enrichedResults);
    } catch (err) {
      console.error("Error searching game:", err);
      res.status(500).send("Error searching game");
    }
  });

  // Register a new user
  app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing username or password" });

    try {
      const db = getDb();
      const existing = await db.collection("users").findOne({ username });
      if (existing) return res.status(409).json({ message: "Username already exists" });

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const result = await db.collection("users").insertOne({ username, password: hashedPassword });
      res.status(201).json({ username, id: result.insertedId });
    } catch (err) {
      res.status(500).json({ message: "Error registering user" });
    }
  });

  // Login
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing username or password" });

    try {
      const db = getDb();
      const user = await db.collection("users").findOne({ username });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: "Invalid credentials" });

      res.status(200).json({ username: user.username, id: user._id });
    } catch (err) {
      res.status(500).json({ message: "Error logging in" });
    }
  });

  // Delete user and orders by ID
  app.delete("/api/users/:id", async (req, res) => {
    const db = getDb();
    const userId = req.params.id;
    try {
      // Delete the User
      const result = await db.collection("users").deleteOne({ _id: new ObjectId(userId) });
      if (result.deletedCount === 1) {
        res.status(200).json({ message: "User deleted" });
      } else {
        res.status(404).json({ message: "User not found" });
      }

      // Delete all orders associated with the user
      const ordersDeleteResult = await db.collection("orders").deleteMany({ userId: userId });
      res.status(200).json({ 
      message: "User and associated orders deleted", 
      ordersDeleted: ordersDeleteResult.deletedCount });
    } catch (err) {
      res.status(500).json({ message: "Error deleting user and orders" });
    }
  });

  // Get orders for a user
  app.get("/api/orders/:userId", async (req, res) => {
    const db = getDb();
    const userId = req.params.userId;
    try {
      const orders = await db.collection("orders").find({ userId }).sort({ date: -1 }).toArray();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  // Create a new order
  app.post("/api/orders", async (req, res) => {
    const db = getDb();
    const order = req.body;
    if (!order || !order.games || !order.price) {
      return res.status(400).json({ message: "Missing order data" });
    }
    try {
      const result = await db.collection("orders").insertOne(order);
      res.status(201).json({ ...order, id: result.insertedId });
    } catch (err) {
      res.status(500).json({ message: "Error saving order" });
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
