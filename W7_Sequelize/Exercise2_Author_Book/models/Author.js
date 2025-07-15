import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Author = sequelize.define('Author', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Assuming author names should be unique for simplicity
    },
    birthYear: {
      type: DataTypes.INTEGER,
      allowNull: true // Birth year might not always be known
    }
  },);

  return Author;
};