import express from 'express';
import courses from './course.js';  // your courses array

import { logger } from './logger.js';
import { validateQuery } from './validateQuery.js';
import { auth } from './auth.js'; // optional

const app = express();
const PORT = 3000;

// Apply logger middleware globally
app.use(logger);

// Apply auth middleware globally 
//app.use(auth);

// Apply validateQuery middleware 
app.get('/departments/:dept/courses', validateQuery, (req, res) => {
  const { dept } = req.params;
  const { level, minCredits, maxCredits, semester, instructor } = req.query;

  let filteredCourses = courses.filter(course => course.department === dept);

  if (level) filteredCourses = filteredCourses.filter(c => c.level === level);
  if (semester) filteredCourses = filteredCourses.filter(c => c.semester === semester);
  if (instructor) filteredCourses = filteredCourses.filter(c => c.instructor.toLowerCase().includes(instructor.toLowerCase()));
  if (minCredits) filteredCourses = filteredCourses.filter(c => c.credits >= parseInt(minCredits));
  if (maxCredits) filteredCourses = filteredCourses.filter(c => c.credits <= parseInt(maxCredits));

  if (filteredCourses.length === 0) {
    return res.status(404).json({ message: 'No matching courses found' });
  }

  res.json(filteredCourses);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
