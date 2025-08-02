import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArticleById } from "../services/api";

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId) => {
    setIsLoading(true);
    setError("");
    try {
      // The API call is updated to fetch combined article + journalist data
      const data = await getArticleById(articleId);
      setArticle(data);
    } catch (err) {
      console.error("Failed to fetch article:", err);
      setError("Failed to load article. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      {/* Display journalist name as a clickable link */}
      <div className="article-author">
        By <span className="journalist-link" onClick={handleJournalistClick}>
          {article.journalistName}
        </span>
      </div>
      <div className="article-content">{article.content}</div>
    </div>
  );
}
