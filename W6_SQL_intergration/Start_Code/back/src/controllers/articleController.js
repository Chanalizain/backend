import * as articleRepository from "../repositories/mockArticleRepository.js";

// TODO : Change articleRepository to use the sqlArticleRepository

// GET /api/articles
export async function getAllArticles(req, res) {
  try {
    const articles = await articleRepository.getArticles();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/:id
export async function getArticleById(req, res) {
  try {
    const article = await articleRepository.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/articles
export async function createArticle(req, res) {
  try {
    const newArticle = await articleRepository.createArticle(req.body);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/articles/:id
export async function updateArticle(req, res) {
  try {
    const updatedArticle = await articleRepository.updateArticle(
      req.params.id,
      req.body
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/articles/:id
export async function deleteArticle(req, res) {
  try {
    await articleRepository.deleteArticle(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/articles/by-journalist-name/:name
 * Fetches all articles written by a specific journalist name.
 */
export async function getArticlesByJournalistName(req, res) {
  try {
    const journalistName = req.params.name;
    const articles = await articleRepository.getArticlesByJournalistName(journalistName);
    if (articles.length === 0) {
      return res.status(404).json({ message: "No articles found for this journalist." });
    }
    res.json(articles);
  } catch (error) {
    console.error(`Error fetching articles by journalist name '${req.params.name}':`, error);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/articles/by-journalist-id/:id
 * Fetches all articles written by a specific journalist ID.
 * This function is used by the route: GET /api/journalists/:id/articles
 */
export async function getArticlesByJournalistId(req, res) {
  try {
    const journalistId = req.params.id; // Get ID from URL parameters
    const articles = await articleRepository.getArticlesByJournalistId(journalistId);
    if (articles.length === 0) {
      return res.status(404).json({ message: "No articles found for this journalist ID." });
    }
    res.json(articles);
  } catch (error) {
    console.error(`Error fetching articles by journalist ID '${req.params.id}':`, error);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/articles/with-journalist-details
 * Fetches all articles including their associated journalist's details.
 * This is an alternative to getAllArticles if you always want the joined data.
 */
export async function getArticlesWithJournalistDetails(req, res) {
  try {
    const articles = await articleRepository.getArticlesWithJournalistName();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles with journalist details:", error);
    res.status(500).json({ message: "Server error" });
  }
}
