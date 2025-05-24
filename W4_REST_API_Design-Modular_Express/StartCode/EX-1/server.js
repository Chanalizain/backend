// server.js
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import logger from './middleware/logger.js';

const app = express();

app.use(express.json());
app.use(logger);

// Mount the user routes
app.use('/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
