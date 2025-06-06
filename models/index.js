const { sequelize } = require('../orm');
const Student = require('./Student');
const Department = require('./Department');
const Course = require('./Course');
const Enrollment = require('./Enrollment');

// 一對多：部門與學生
Department.hasMany(Student, { foreignKey: 'Department_ID' });
Student.belongsTo(Department, { foreignKey: 'Department_ID' });

// 一對多：部門與課程
Department.hasMany(Course, { foreignKey: 'Department_ID' });
Course.belongsTo(Department, { foreignKey: 'Department_ID' });

// 多對多：學生與課程，透過 Enrollment
Student.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: 'Student_ID',
  otherKey: 'Course_ID'
});

Course.belongsToMany(Student, {
  through: Enrollment,
  foreignKey: 'Course_ID',
  otherKey: 'Student_ID'
});

Enrollment.belongsTo(Student, { foreignKey: 'Student_ID' });
Enrollment.belongsTo(Course, { foreignKey: 'Course_ID' });

module.exports = {
  sequelize,
  Student,
  Department,
  Course,
  Enrollment
};