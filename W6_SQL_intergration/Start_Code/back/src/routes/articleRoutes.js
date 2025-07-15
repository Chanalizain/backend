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

const articleRouter = Router(); 

articleRouter.get("/", getAllArticles); 
articleRouter.post("/", createArticle); 
articleRouter.put("/:id", updateArticle); 
articleRouter.delete("/:id", deleteArticle); 

// Current GET /api/articles/:id route.
// NOTE: As per your current controller and repository, getArticleById only fetches basic article data.
// If you want this specific endpoint to return the article *with* the journalist's name and other details,
// you would need to modify the getArticleById function in sqlArticleRepository.js to perform a JOIN.
articleRouter.get("/:id", getArticleById); 


// Routes for filtering articles by journalist (name and ID) and for all articles with journalist details
articleRouter.get("/by-journalist-name/:name", getArticlesByJournalistName); 
articleRouter.get("/with-journalist-details", getArticlesWithJournalistDetails); 

// NEW ROUTE: GET /api/journalists/:id/articles - fetches articles list by a specific journalist ID.
// This route leverages the existing getArticlesByJournalistId controller function.
articleRouter.get("/journalists/:id/articles", getArticlesByJournalistId); 

export default articleRouter; 