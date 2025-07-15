import { categories, articles } from '../models/data.js';

export const getAllCategories = (req, res) => {
  res.json(categories);
};

export const getCategoryById = (req, res) => {
  const id = parseInt(req.params.id);
  const category = categories.find(c => c.id === id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
};

export const createCategory = (req, res) => {
  const newCategory = { id: categories.length + 1, ...req.body };
  categories.push(newCategory);
  res.status(201).json(newCategory);
};

export const updateCategory = (req, res) => {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  categories[index] = { ...categories[index], ...req.body };
  res.json(categories[index]);
};

export const deleteCategory = (req, res) => {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  categories.splice(index, 1);
  res.status(204).send();
};

export const getArticlesByCategoryId = (req, res) => {
  const id = parseInt(req.params.id);
  const category = categories.find(c => c.id === id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  const result = articles.filter(a => a.categoryId === id);
  res.json(result);
};