// models/index.js
import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname is not available in ES Modules directly.
// We need to derive it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'), // Correct path to database file
  logging: false, // Set to true to see SQL queries in the console
});

// Load models
// Using .default because each model file exports a default function
import defineAuthor from './Author.js';
import defineBook from './Book.js';

const Author = defineAuthor(sequelize);
const Book = defineBook(sequelize);

// Define associations
Author.hasMany(Book, {
  onDelete: 'CASCADE',
});
Book.belongsTo(Author);

// Export models and sequelize instance
export {
  sequelize,
  Author,
  Book,
};