/**
 * User Model
 * Defines the User table structure and behavior in the database
 * Includes password hashing hooks and role-based authentication
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    // Primary key
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Username field with uniqueness constraint
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Email field with validation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // Password field (will be hashed before save)
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Role-based access control
    role: {
      type: DataTypes.ENUM("student", "tutor", "parent", "admin", "superadmin"),
      allowNull: false,
      defaultValue: "student",
    },
    // Account status
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Reference to admin who created the user (if applicable)
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    // Hooks for password hashing
    hooks: {
      // Hash password before creating new user
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // Hash password before updating user if password is changed
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

/**
 * Instance method to validate user password
 * @param {string} password - The password to validate
 * @returns {Promise<boolean>} - True if password matches, false otherwise
 */
User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
