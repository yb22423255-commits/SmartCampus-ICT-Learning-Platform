const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Lesson = sequelize.define("Lesson", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    videoUrl: {
        type: DataTypes.STRING
    },

    fileUrl: {
        type: DataTypes.STRING
    },

    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

});

module.exports = Lesson;