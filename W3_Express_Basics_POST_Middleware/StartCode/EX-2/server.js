// server.js
import express from "express";
import courses from "./course.js";
const app = express();
const PORT = 3000;

// Route: GET /departments/:dept/courses
app.get('/departments/:dept/courses', (req, res) => {
    const { dept } = req.params;
    const { level, minCredits, maxCredits, semester, instructor } = req.query;
    // Implementing the filter logic
    // Hint: Use the filter method to filter the courses array based on the provided criteria

    // Convert credit filters to numbers if provided
    const min = minCredits ? parseInt(minCredits) : null;
    const max = maxCredits ? parseInt(maxCredits) : null;

    // Handle invalid credit range
    if (min !== null && max !== null && min > max) {
        return res.status(400).json({
        error: 'Invalid credit range: minCredits cannot be greater than maxCredits.',
        });
    }

    // Filter by department
    let filtered = courses.filter(course => course.department.toLowerCase() === dept.toLowerCase());

    // Apply optional filters
    if (level) {
        filtered = filtered.filter(course => course.level.toLowerCase() === level.toLowerCase());
    }

    if (semester) {
        filtered = filtered.filter(course => course.semester.toLowerCase() === semester.toLowerCase());
    }

    if (instructor) {
        filtered = filtered.filter(course =>
        course.instructor.toLowerCase().includes(instructor.toLowerCase())
        );
    }

    if (min !== null) {
        filtered = filtered.filter(course => course.credits >= min);
    }

    if (max !== null) {
        filtered = filtered.filter(course => course.credits <= max);
    }

    // Handle case: no matching courses
    if (filtered.length === 0) {
        return res.status(404).json({ message: 'No matching courses found.' });
    }

    // Return matching courses
    res.json(filtered);
        
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
