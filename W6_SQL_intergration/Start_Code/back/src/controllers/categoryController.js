import * as categoryRepository from "../repositories/sqlArticleRepository.js";

export async function getAllCategories(req, res) {
  try {
    const categories = await categoryRepository.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getArticlesByCategoryId(req, res) {
  try {
    const categoryId = req.params.id;
    const articles = await categoryRepository.getArticlesByCategoryId(categoryId);
    if (articles.length === 0) {
      return res.status(404).json({ message: "No articles found for this category." });
    }
    res.json(articles);
  } catch (error) {
    console.error(`Error fetching articles by category ID '${req.params.id}':`, error);
    res.status(500).json({ message: "Server error" });
  }
}