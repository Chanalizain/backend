import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByJournalistName,
  getArticlesByJournalistId,
  getArticlesWithJournalistDetails
} from "../controllers/articleController.js";

import * as categoriesController from "../controllers/categoryController.js";
import * as journalistsController from "../controllers/journalistController.js";

const articleRouter = Router();

// Basic CRUD routes for articles
articleRouter.get("/articles", getAllArticles);
articleRouter.post("/articles", createArticle);
articleRouter.put("/articles/:id", updateArticle);
articleRouter.delete("/articles/:id", deleteArticle);

// A standard route to get an article by ID (without journalist details)
articleRouter.get("/articles/:id", getArticleById);

// NEW ROUTE: A specific endpoint to get an article with its journalist details.
// This matches the updated getArticleById call in your frontend's api.js file.
articleRouter.get("/articles/:id/with-journalist-details", getArticlesWithJournalistDetails);

// Routes for filtering and fetching data
articleRouter.get("/journalists/:id/articles", getArticlesByJournalistId);
articleRouter.get("/articles/by-journalist-name/:name", getArticlesByJournalistName);


// New routes for categories
articleRouter.get("/categories", categoriesController.getAllCategories);
articleRouter.get("/categories/:id/articles", categoriesController.getArticlesByCategoryId);

// New routes for journalists
articleRouter.get("/journalists", journalistsController.getAllJournalists);

export default articleRouter;
