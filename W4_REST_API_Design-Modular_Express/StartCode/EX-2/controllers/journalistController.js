import { journalists, articles } from '../models/data.js';

export const getAllJournalists = (req, res) => {
  res.json(journalists);
};

export const getJournalistById = (req, res) => {
  const id = parseInt(req.params.id);
  const journalist = journalists.find(j => j.id === id);
  if (!journalist) return res.status(404).json({ error: 'Journalist not found' });
  res.json(journalist);
};

export const createJournalist = (req, res) => {
  const newJournalist = { id: journalists.length + 1, ...req.body };
  journalists.push(newJournalist);
  res.status(201).json(newJournalist);
};

export const updateJournalist = (req, res) => {
  const id = parseInt(req.params.id);
  const index = journalists.findIndex(j => j.id === id);
  if (index === -1) return res.status(404).json({ error: 'Journalist not found' });
  journalists[index] = { ...journalists[index], ...req.body };
  res.json(journalists[index]);
};

export const deleteJournalist = (req, res) => {
  const id = parseInt(req.params.id);
  const index = journalists.findIndex(j => j.id === id);
  if (index === -1) return res.status(404).json({ error: 'Journalist not found' });
  journalists.splice(index, 1);
  res.status(204).send();
};

export const getArticlesByJournalistId = (req, res) => {
  const id = parseInt(req.params.id);
  const journalist = journalists.find(j => j.id === id);
  if (!journalist) return res.status(404).json({ error: 'Journalist not found' });
  const result = articles.filter(a => a.journalistId === id);
  res.json(result);
};