/**
 * Database Configuration
 * This file sets up the Sequelize connection to the MySQL database
 * using environment variables for secure configuration
 */

const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create Sequelize instance with database credentials from environment variables 
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // Disable SQL query logging in console
    pool: {
      max: 5, // Maximum number of connection in pool
      min: 0, // Minimum number of connection in pool
      acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
    },
  }
);

module.exports = sequelize;
