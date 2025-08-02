// models/attendanceRecord.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const AttendanceRecord = sequelize.define('AttendanceRecord', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late'),
      allowNull: false,
      defaultValue: 'absent',
    },
  });

  return AttendanceRecord;
};