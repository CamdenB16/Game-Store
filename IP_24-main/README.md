# Joystick Journeys

A modern React-based web application for discovering, searching, and purchasing video games, featuring user authentication, order history, and a dynamic shopping cart.

## Note for Viewers

This website is currently not hosted. If you would like a rundown of how the code works and a demo of the working website, navigate to this directory and download the video file. Hope you enjoy!

Directory: Game-Store/IP_24-main/Documents/Mini-Assignments/mini_assignment_2/CamdenHenry_FinalProject.mp4

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Getting Started Locally](#getting-started-locally)
- [CRUD Operations & Entities](#crud-operations--entities)

---

## Features

- 🎮 **Game Showcase**: Browse and search a curated list of games on the homepage.
- 🛒 **Shopping Cart**: Add games to your cart and proceed to checkout.
- 🔍 **Search & Filter**: Search bar and genre toggles for quick navigation.
- 👤 **User Authentication**: Sign up, log in, and persistent user sessions.
- 📦 **Order History**: View past purchases and detailed order summaries.
- 💳 **Checkout**: Enter payment and shipping info.
- 📝 **Order Summary**: See confirmation and details after a purchase.
- 👾 **Game Browser**: Browse and search a massive list of games, courtesy of rawg.io.

---

## Tech Stack

- **React**
- **Bootstrap 5** 
- **Tailwind CSS** 
- **Local Storage** 
- **JavaScript**
- **Rawg.io** 
- **MongoDB** 

---

## Usage

- **Browse Games**: Use the search bar or genre toggles above the showcase to find games.
- **Add to Cart**: Click "Add to Cart" on any game or from the carousel.
- **Sign Up / Login**: Create an account or log in to access your profile and order history.
- **Checkout**: Fill out the payment form to place an order.
- **View Orders**: Access your profile to see all past purchases and order details.
- **Logout**: Use the logout button in your profile/orders page.
- **Delete Account**: Press to delete the user account and any orders associated with that user.

---

## API Integration 

- **Rawg.io**: Used to get info on a massive library of games.
- **MongoDB**: Stores game and user data.

## Getting Started Locally

Follow these steps to run the project on your local machine:

### 1. Prerequisites

- **Node.js**
- **MongoDB Community Server**  
  [Download MongoDB](https://www.mongodb.com/try/download/community) and install it.

---

### 2. Install Dependencies

#### Frontend

Open a terminal in the frontend project folder and run:
``` npm install ```

#### Backend

Open a terminal in the backend project folder and run:
``` npm install ```

---

### 3. Start MongoDB

Start the MongoDB server in a terminal:
``` mongod ```

If you see an error about a missing data directory, create `C:\data\db` (Windows) or `/data/db` (macOS/Linux).
Also ensure MongoDB is installed and added to your system PATH.

---

### 4. Start the Backend Server

In the backend folder, run:
``` nodemon server.js ```

---

### 5. Start the Frontend Development Server

In the frontend folder, run:
``` npm run dev ```

---

### 6. Open the Website

- Visit [http://localhost:5173](http://localhost:5173) (or the port shown in terminal) in your browser.

---

### 7. Typical Local Development Setup

You should have **three terminals open**:
- One running `mongod` (MongoDB server)
- One running `nodemon server.js` (backend)
- One running `npm run dev` (frontend)

---

## CRUD Operations & Entities

The backend exposes RESTful API endpoints that perform CRUD (Create, Read, Update, Delete) operations on the following entities:

### Users
- **Create:**  
  `POST /api/register` - Registers a new user (with hashed password).
- **Read:**  
  `POST /api/login` - Authenticates a user and retrieves their info.
- **Delete:**  
  `DELETE /api/users/:id` - Deletes a user by ID and cascades to delete all their orders.

### Games
- **Read:**  
  `GET /api/randomGames` - Retrieves a selection of recent/popular games from the RAWG API.  
  `GET /api/searchGame` - Searches for games by keyword and caches results in MongoDB.

### Orders
- **Create:**  
  `POST /api/orders` - Creates a new order and ties it to the user.
- **Read:**  
  `GET /api/orders/:userId` - Retrieves all orders for a specific user (sorted by most recent).
- **Delete (Cascade):**  
  When a user is deleted, all their orders are also deleted.

---

### Entities Affected

- **users:** Stores registered user accounts with hashed passwords.
- **games:** Stores cached game data from the RAWG API.
- **orders:** Stores all user orders, each linked to the user via a `userId` field.
