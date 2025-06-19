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
    // Basic Information
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Additional Information
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    localGovt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    privacyPolicy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // Role and Status
    role: {
      type: DataTypes.ENUM("student", "tutor", "parent", "admin", "superadmin"),
      allowNull: false,
      defaultValue: "student",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Payment Information
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    paymentAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 2.5,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
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
