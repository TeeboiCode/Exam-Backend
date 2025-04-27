/**
 * Database Migrations
 * Creates all necessary tables for the exam system
 */

const sequelize = require("./db");
const { DataTypes } = require("sequelize");

// User model (already defined in models/User.js)
const User = require("../models/User");

// Subject model
const Subject = sequelize.define("Subject", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Topic model
const Topic = sequelize.define("Topic", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Subjects",
      key: "id",
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Question model
const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  correctAnswer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  difficulty: {
    type: DataTypes.ENUM("easy", "medium", "hard"),
    defaultValue: "medium",
  },
  topicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Topics",
      key: "id",
    },
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Exam model
const Exam = sequelize.define("Exam", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
  },
  totalMarks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  passingMarks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Subjects",
      key: "id",
    },
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// ExamQuestion model (for mapping exams to questions)
const ExamQuestion = sequelize.define("ExamQuestion", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  examId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Exams",
      key: "id",
    },
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Questions",
      key: "id",
    },
  },
  marks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// StudentExam model (for tracking student exam attempts)
const StudentExam = sequelize.define("StudentExam", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  examId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Exams",
      key: "id",
    },
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("in_progress", "completed", "abandoned"),
    defaultValue: "in_progress",
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

// Define relationships
Subject.hasMany(Topic, { foreignKey: "subjectId" });
Topic.belongsTo(Subject, { foreignKey: "subjectId" });

Topic.hasMany(Question, { foreignKey: "topicId" });
Question.belongsTo(Topic, { foreignKey: "topicId" });

User.hasMany(Question, { foreignKey: "createdBy" });
Question.belongsTo(User, { foreignKey: "createdBy" });

Subject.hasMany(Exam, { foreignKey: "subjectId" });
Exam.belongsTo(Subject, { foreignKey: "subjectId" });

User.hasMany(Exam, { foreignKey: "createdBy" });
Exam.belongsTo(User, { foreignKey: "createdBy" });

Exam.belongsToMany(Question, { through: ExamQuestion });
Question.belongsToMany(Exam, { through: ExamQuestion });

User.hasMany(StudentExam, { foreignKey: "studentId" });
StudentExam.belongsTo(User, { foreignKey: "studentId" });

Exam.hasMany(StudentExam, { foreignKey: "examId" });
StudentExam.belongsTo(Exam, { foreignKey: "examId" });

// Export models
module.exports = {
  User,
  Subject,
  Topic,
  Question,
  Exam,
  ExamQuestion,
  StudentExam,
};
