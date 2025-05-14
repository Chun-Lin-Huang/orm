const { sequelize, DataTypes } = require('../orm');

const Department = sequelize.define('Department', {
  Department_ID: {
    type: DataTypes.STRING(5),
    primaryKey: true
  },
  Name: { // Department_Name 要改成 Name
    type: DataTypes.STRING(50),
    allowNull: false
  },
  // Building: DataTypes.STRING(30),
  // Budget: DataTypes.DECIMAL(12, 2),
  Location: DataTypes.STRING(50),
  Phone: DataTypes.STRING(15),
  Established_Year: DataTypes.INTEGER,
  Chair_ID: DataTypes.STRING(6),
  College: DataTypes.STRING(30)
}, {
  tableName: 'DEPARTMENT',
  timestamps: false
});

module.exports = Department;