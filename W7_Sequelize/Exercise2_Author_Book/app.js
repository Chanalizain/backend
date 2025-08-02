// app.js
import { sequelize, Author, Book } from './models/index.js'; // Note the .js extension

async function runSequelizeOperations() {
  try {
    // Synchronize all models with the database (create tables if they don't exist)
    await sequelize.sync({ force: true }); // `force: true` will drop existing tables

    console.log('Database and tables created!');

    // --- Q2: Create sample data ---

    console.log('\n--- Creating sample data ---');

    const ronan = await Author.create({ name: 'Ronan The Best', birthYear: 1990 });
    const kim = await Author.create({ name: 'Kim Ang', birthYear: 1995 });
    const hok = await Author.create({ name: 'Hok Tim', birthYear: 2015 });

    await ronan.createBook({ title: 'The Adventures of Ronan', publicationYear: 2010, pages: 300 });
    await ronan.createBook({ title: 'Ronan\'s Journey', publicationYear: 2015, pages: 250 });
    await ronan.createBook({ title: 'Decoding the Universe', publicationYear: 2020, pages: 450 }); 

    await kim.createBook({ title: 'Secrets of the Code', publicationYear: 2018, pages: 180 });
    await kim.createBook({ title: 'Beyond the Horizon', publicationYear: 2022, pages: 220 });

    await hok.createBook({ title: 'My First Storybook', publicationYear: 2020, pages: 100 });
    await hok.createBook({ title: 'Tiny Tales', publicationYear: 2024, pages: 120 });

    console.log('Sample data created successfully!');

    // --- Q3: Queries ---

    console.log('\n--- Performing Queries ---');

    // Fetch all books by a given author (e.g., Ronan The Best)
    console.log('\nFetching all books by Ronan The Best:');
    const ronanBooks = await Book.findAll({
      where: {
        AuthorId: ronan.id,
      },
    });
    ronanBooks.forEach(book => console.log(`- ${book.title} (Published: ${book.publicationYear}, Pages: ${book.pages})`));

    // Create a new book for an existing author using .createBook() (e.g., Kim Ang)
    console.log('\nCreating a new book for Kim Ang:');
    const newBookForKim = await kim.createBook({
      title: 'The Unseen Path',
      publicationYear: 2025,
      pages: 280,
    });
    console.log(`New book created: "${newBookForKim.title}" for Kim Ang`);

    // List all authors along with their books (include)
    console.log('\nListing all authors with their books:');
    const authorsWithBooks = await Author.findAll({
      include: Book, // This will include the associated books for each author
    });

    authorsWithBooks.forEach(author => {
      console.log(`\nAuthor: ${author.name} (Born: ${author.birthYear})`);
      if (author.Books && author.Books.length > 0) {
        author.Books.forEach(book => {
          console.log(`  - Book: ${book.title} (Published: ${book.publicationYear}, Pages: ${book.pages})`);
        });
      } else {
        console.log('  No books found for this author.');
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the operations
runSequelizeOperations();