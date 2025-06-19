"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "firstName", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "lastName", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "phone", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "maritalStatus", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "dob", {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "state", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "localGovt", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "address", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "nationality", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "nin", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "department", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "gender", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "privacyPolicy", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("Users", "paymentStatus", {
      type: Sequelize.STRING,
      defaultValue: "pending",
    });

    await queryInterface.addColumn("Users", "paymentAmount", {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 2.5,
    });

    await queryInterface.addColumn("Users", "paymentDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "firstName");
    await queryInterface.removeColumn("Users", "lastName");
    await queryInterface.removeColumn("Users", "phone");
    await queryInterface.removeColumn("Users", "maritalStatus");
    await queryInterface.removeColumn("Users", "dob");
    await queryInterface.removeColumn("Users", "state");
    await queryInterface.removeColumn("Users", "localGovt");
    await queryInterface.removeColumn("Users", "address");
    await queryInterface.removeColumn("Users", "nationality");
    await queryInterface.removeColumn("Users", "nin");
    await queryInterface.removeColumn("Users", "department");
    await queryInterface.removeColumn("Users", "gender");
    await queryInterface.removeColumn("Users", "privacyPolicy");
    await queryInterface.removeColumn("Users", "paymentStatus");
    await queryInterface.removeColumn("Users", "paymentAmount");
    await queryInterface.removeColumn("Users", "paymentDate");
  },
};
