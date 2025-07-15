import { Sequelize } from 'sequelize';

// 1. Initialize Sequelize (Connect to the database)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // This will create a file named database.sqlite
  logging: false // Disable logging SQL queries to console for cleaner output
});

// 2. Import model definitions
// Assuming models/author.js and models/book.js exist in your project
const Author = require('./models/Author')(sequelize);
const Book = require('./models/Book')(sequelize);

// 3. Define relationships
// An Author can write many Books, but a Book is written by one Author.
Author.hasMany(Book, {
  foreignKey: 'authorId', // This explicitly names the foreign key in the Book table
  onDelete: 'CASCADE'     // If an Author is deleted, delete their associated Books
});
Book.belongsTo(Author, {
  foreignKey: 'authorId'
});

async function createSampleData() {
  try {
    // Ensure database is synced (and cleared with force: true for fresh data)
    await sequelize.sync({ force: true });
    console.log('Database synced. Tables recreated.');

    // --- Create Authors ---
    console.log('\nCreating Authors...');
    const ronan = await Author.create({ name: 'Ronan The Best', birthYear: 1990 });
    console.log(`Created Author: ${ronan.name} (ID: ${ronan.id})`);

    const kim = await Author.create({ name: 'Kim Ang', birthYear: 1995 });
    console.log(`Created Author: ${kim.name} (ID: ${kim.id})`);

    const hok = await Author.create({ name: 'Hok Tim', birthYear: 2015 });
    console.log(`Created Author: ${hok.name} (ID: ${hok.id})`);

    // --- Create Books and Associate with Authors ---
    console.log('\nCreating Books and associating them with Authors...');

    // Books for Ronan
    await ronan.createBook({ title: 'The Silent Whispers', publicationYear: 2018, pages: 320 });
    await ronan.createBook({ title: 'Echoes of Tomorrow', publicationYear: 2020, pages: 450 });
    console.log(`- Added 2 books for ${ronan.name}`);

    // Books for Kim
    await kim.createBook({ title: 'Journey to the Unknown', publicationYear: 2005, pages: 280 });
    await kim.createBook({ title: 'Stars Above Us', publicationYear: 2010, pages: 510 });
    await kim.createBook({ title: 'Whispers of the Wind', publicationYear: 2015, pages: 190 }); // More than 2 books
    console.log(`- Added 3 books for ${kim.name}`);

    // Books for Hok
    await hok.createBook({ title: 'Adventures of Little Bear', publicationYear: 2022, pages: 120 });
    await hok.createBook({ title: 'My First Coding Book', publicationYear: 2024, pages: 90 });
    console.log(`- Added 2 books for ${hok.name}`);

    console.log('\nSample data creation complete!');

  } catch (error) {
    console.error('Error creating sample data:', error);
  }
}

async function runQueries() {
  try {
    console.log('\n--- Running Queries ---');

    // Query 1: Fetch all books by a given author (e.g., Ronan The Best)
    console.log('\n1. Fetching all books by "Ronan The Best":');
    const ronanAuthor = await Author.findOne({ where: { name: 'Ronan The Best' } });
    if (ronanAuthor) {
      const ronanBooks = await ronanAuthor.getBooks(); // Using the generated accessor method
      ronanBooks.forEach(book => {
        console.log(`   - Title: ${book.title}, Published: ${book.publicationYear}, Pages: ${book.pages}`);
      });
    } else {
      console.log('   Author "Ronan The Best" not found.');
    }

    // Query 2: Create a new book for an existing author using .createBook() (e.g., Kim Ang)
    console.log('\n2. Creating a new book for "Kim Ang" using .createBook():');
    const kimAuthor = await Author.findOne({ where: { name: 'Kim Ang' } });
    if (kimAuthor) {
      const newBookForKim = await kimAuthor.createBook({
        title: 'The Secret of the Old Lighthouse',
        publicationYear: 2025,
        pages: 350
      });
      console.log(`   - New book created for ${kimAuthor.name}: "${newBookForKim.title}" (ID: ${newBookForKim.id})`);
    } else {
      console.log('   Author "Kim Ang" not found.');
    }

    // Query 3: List all authors along with their books (include)
    console.log('\n3. Listing all authors along with their books:');
    const allAuthorsWithBooks = await Author.findAll({
      include: Book // This tells Sequelize to also fetch associated Books for each Author
    });

    allAuthorsWithBooks.forEach(author => {
      console.log(`\nAuthor: ${author.name} (Born: ${author.birthYear})`);
      if (author.Books && author.Books.length > 0) {
        author.Books.forEach(book => {
          console.log(`   - Book: "${book.title}" (Published: ${book.publicationYear}, Pages: ${book.pages})`);
        });
      } else {
        console.log('   - No books found for this author.');
      }
    });

    console.log('\nAll queries complete!');

  } catch (error) {
    console.error('Error running queries:', error);
  } finally {
    // Close the database connection when all operations are done
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Call the functions in sequence
async function main() {
  await createSampleData();
  await runQueries();
}

main();
