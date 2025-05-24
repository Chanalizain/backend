import { articles } from '../models/data.js';

export const getAllArticles = (req, res) => {
  res.json(articles);
};

export const getArticleById = (req, res) => {
  const id = parseInt(req.params.id);
  const article = articles.find(a => a.id === id);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
};

export const createArticle = (req, res) => {
  const newArticle = { id: articles.length + 1, ...req.body };
  articles.push(newArticle);
  res.status(201).json(newArticle);
};

export const updateArticle = (req, res) => {
  const id = parseInt(req.params.id);
  const index = articles.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Article not found' });
  articles[index] = { ...articles[index], ...req.body };
  res.json(articles[index]);
};

export const deleteArticle = (req, res) => {
  const id = parseInt(req.params.id);
  const index = articles.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Article not found' });
  articles.splice(index, 1);
  res.status(204).send();
};