/**
 * Main Server File
 * Sets up Express server with middleware and routes
 * Handles database synchronization and server startup
 */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Initialize Express app
const app = express();
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/student");

// Import database models
const models = require("./config/migrations");

// Configure middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Register routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/student", studentRoutes); // Student registration routes

// Server configuration
const PORT = process.env.PORT || 3000;

/**
 * Start server and sync database
 * Synchronizes database schema and starts Express server
 */
async function startServer() {
  try {
    // Sync database models with database schema
    await sequelize.sync();
    console.log("Database synchronized successfully");

    // Create default admin user if not exists
    const adminExists = await models.User.findOne({
      where: { role: "superadmin" },
    });

    if (!adminExists) {
      await models.User.create({
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
        role: "superadmin",
        isActive: true,
      });
      console.log("Default admin user created");
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
}

// Start the server
startServer();
