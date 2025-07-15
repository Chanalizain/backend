import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publicationYear: {
      type: DataTypes.INTEGER,
      allowNull: true // Publication year might not always be known or relevant for all books
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: true // Number of pages might not always be known or relevant for all books
    }
  },);

  return Book;
};