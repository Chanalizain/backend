// app.js
import express from 'express';
import { Op, fn, col } from 'sequelize'; // Import Op and other Sequelize functions
import { sequelize, Student, Class, AttendanceRecord } from './models/index.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Q3 & Q4: Core logic and API routes

// Helper function to seed the database with sample data
const seedDatabase = async () => {
  await sequelize.sync({ force: true }); // Drop and recreate tables

  console.log('Database and tables created!');

  const mathClass = await Class.create({ name: 'Math 101' });
  const scienceClass = await Class.create({ name: 'Science 202' });

  const student1 = await Student.create({ name: 'Jane Doe', ClassId: mathClass.id });
  const student2 = await Student.create({ name: 'John Smith', ClassId: mathClass.id });
  const student3 = await Student.create({ name: 'Peter Jones', ClassId: scienceClass.id });

  // Mark some initial attendance records
  await AttendanceRecord.create({
    date: '2025-06-17',
    status: 'present',
    StudentId: student1.id,
    ClassId: mathClass.id,
  });

  await AttendanceRecord.create({
    date: '2025-06-17',
    status: 'absent',
    StudentId: student2.id,
    ClassId: mathClass.id,
  });

  await AttendanceRecord.create({
    date: '2025-06-18',
    status: 'late',
    StudentId: student1.id,
    ClassId: mathClass.id,
  });

  console.log('Sample data created!');
};

// API endpoint to mark attendance for a student in a class on a given date
// POST /attendance?studentId=1&classId=1&date=2025-06-17&status=present
app.post('/attendance', async (req, res) => {
  try {
    const { studentId, classId, date, status } = req.query;

    if (!studentId || !classId || !date || !status) {
      return res.status(400).json({ error: 'studentId, classId, date, and status are required.' });
    }

    const [attendance, created] = await AttendanceRecord.findOrCreate({
      where: {
        StudentId: studentId,
        ClassId: classId,
        date: date,
      },
      defaults: {
        status: status,
      },
    });

    if (!created) {
      // If the record already exists, update the status
      await attendance.update({ status: status });
      return res.status(200).json({ message: 'Attendance updated successfully.', attendance });
    }

    res.status(201).json({ message: 'Attendance marked successfully.', attendance });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

// API endpoint to get attendance for a student on a specific date
// GET /attendance?studentId=1&date=2025-06-17
app.get('/attendance', async (req, res) => {
  try {
    const { studentId, date } = req.query;

    if (!studentId || !date) {
      return res.status(400).json({ error: 'studentId and date are required.' });
    }

    const attendance = await AttendanceRecord.findOne({
      where: {
        StudentId: studentId,
        date: date,
      },
      include: [Student, Class],
    });

    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found.' });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error getting attendance:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

// API endpoint to list attendance for all students in a class
// GET /classes/:id/attendance
app.get('/classes/:id/attendance', async (req, res) => {
  try {
    const classId = req.params.id;

    const attendanceList = await AttendanceRecord.findAll({
      where: {
        ClassId: classId,
      },
      include: [
        {
          model: Student,
          attributes: ['id', 'name'],
        },
        {
          model: Class,
          attributes: ['id', 'name'],
        },
      ],
      order: [['date', 'DESC']],
    });

    if (!attendanceList || attendanceList.length === 0) {
      return res.status(404).json({ error: 'No attendance records found for this class.' });
    }

    res.status(200).json(attendanceList);
  } catch (error) {
    console.error('Error listing class attendance:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

// API endpoint to get an attendance summary for a student
// GET /students/:id/attendance
app.get('/students/:id/attendance', async (req, res) => {
  try {
    const studentId = req.params.id;

    // Use Sequelize to count attendance statuses and group them
    const summary = await AttendanceRecord.findAll({
      where: {
        StudentId: studentId,
      },
      attributes: [
        'status',
        [fn('COUNT', col('status')), 'count']
      ],
      group: ['status'],
    });

    if (!summary || summary.length === 0) {
      return res.status(404).json({ error: 'No attendance records found for this student.' });
    }

    const student = await Student.findByPk(studentId, { include: Class });

    const formattedSummary = summary.reduce((acc, item) => {
      acc[item.dataValues.status] = item.dataValues.count;
      return acc;
    }, {});
    
    // Fill in any missing statuses with a count of 0 for a complete summary
    const finalSummary = {
        present: formattedSummary.present || 0,
        absent: formattedSummary.absent || 0,
        late: formattedSummary.late || 0,
    };

    res.status(200).json({
      student: {
        id: student.id,
        name: student.name,
        class: student.Class ? student.Class.name : 'N/A'
      },
      summary: finalSummary,
    });
  } catch (error) {
    console.error('Error getting student summary:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

// Start the server after seeding the database
const PORT = process.env.PORT || 3000;
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return seedDatabase();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database or start the server:', err);
  });
