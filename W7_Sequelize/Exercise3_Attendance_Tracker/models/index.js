// models/index.js
import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false, // Set to true to see SQL queries
});

// Q1: Define the models and their properties
import defineStudent from './student.js';
import defineClass from './class.js';
import defineAttendanceRecord from './attendanceRecord.js';

const Student = defineStudent(sequelize);
const Class = defineClass(sequelize);
const AttendanceRecord = defineAttendanceRecord(sequelize);

// Q2: Define the relationships between the 3 models
// A Student belongs to a Class
Student.belongsTo(Class);
Class.hasMany(Student);

// An AttendanceRecord belongs to a Student and a Class
AttendanceRecord.belongsTo(Student, { onDelete: 'CASCADE' });
Student.hasMany(AttendanceRecord);

AttendanceRecord.belongsTo(Class, { onDelete: 'CASCADE' });
Class.hasMany(AttendanceRecord);

// Export models and sequelize instance
export {
  sequelize,
  Student,
  Class,
  AttendanceRecord,
};
