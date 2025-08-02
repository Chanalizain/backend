import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArticlesByJournalistId } from "../services/api";
import { ArticleCard } from "./ArticleList.jsx"; // Correctly import the named component

export default function JournalistArticlesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchArticles(id);
    }
  }, [id]);

  const fetchArticles = async (journalistId) => {
    setIsLoading(true);
    setError("");
    try {
      // The API call is updated to fetch articles by journalist ID
      const data = await getArticlesByJournalistId(journalistId);
      setArticles(data);
    } catch (err) {
      console.error("Failed to fetch journalist's articles:", err);
      setError("Failed to load articles for this journalist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleView = (articleId) => navigate(`/articles/${articleId}`);
  const handleEdit = (articleId) => navigate(`/articles/${articleId}/edit`);
  const handleJournalistView = (journalistId) => navigate(`/journalists/${journalistId}/articles`);
  
  // Note: deleteArticle functionality is not implemented on this page.
  const handleDelete = () => {};

  if (isLoading) {
    return <p>Loading articles...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (articles.length === 0) {
    return <p>No articles found for this journalist.</p>;
  }

  return (
    <div className="journalist-articles">
      {/* Safety check for articles[0] before rendering */}
      {articles.length > 0 && <h2>Articles by {articles[0].journalistName}</h2>}
      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard 
            key={article.id}
            article={article}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onJournalistView={handleJournalistView}
          />
        ))}
      </div>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}