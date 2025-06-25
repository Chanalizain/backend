import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { getArticleById } from "../services/api"; // Ensure getArticleById is imported

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]); // Rerun effect if ID changes

  const fetchArticle = async (articleId) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticleById(articleId);
      setArticle(data);
    } catch (err) {
      console.error("Failed to fetch article:", err);
      setError("Failed to load article. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to navigate to journalist's articles (kept, but not directly used in simplified UI)
  const handleJournalistClick = () => {
    if (article && article.journalist_id) {
      // Navigate to the new route for journalist's articles
      navigate(`/journalists/${article.journalist_id}/articles`);
    }
  };

  if (isLoading) {
    return <p>Loading article details...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!article) {
    return <p>Article not found.</p>;
  }

  return (
    <div className="article-details">
      <h2>{article.title}</h2>
      {/* Removed journalist display, as per the image */}
      {/* Removed category display, as per the image */}
      <div className="article-content">{article.content}</div>

      {/* Removed optional journalist details and back button, as per the image */}
    </div>
  );
}

