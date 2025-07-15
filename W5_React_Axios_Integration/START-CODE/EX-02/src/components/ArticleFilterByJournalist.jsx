import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilterByJournalist() {
  const [articles, setArticles] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedJournalistId, setSelectedJournalistId] = useState('');

  // Fetch all articles and journalists when component mounts
  useEffect(() => {
    fetchArticles();
    fetchJournalists();
  }, []);

  const fetchArticles = async () => {
    // Fetch articles from the API
    try {
      const res = await axios.get('http://localhost:5000/articles');
      setArticles(res.data);
      setFilteredArticles(res.data); // Initialize filtered list
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const fetchJournalists = async () => {
    // Fetch journalists from the API
    try {
      const res = await axios.get('http://localhost:5000/journalists');
      setJournalists(res.data);
    } catch (error) {
      console.error('Error fetching journalists:', error);
    }
  };

  const applyFilter = () => {
    // Apply filter based on selected journalist
    if (!selectedJournalistId) {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        (a) => String(a.journalistId) === selectedJournalistId
      );
      setFilteredArticles(filtered);
    }
  };

  const resetFilter = () => {
    // Reset the filter to show all articles
    setSelectedJournalistId('');
    setFilteredArticles(articles);
  };

  return (
    <div>
      <h2>Articles</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <label htmlFor="journalistFilter">Filter by Journalist:</label>
        <select
          id="journalistFilter"
          value={selectedJournalistId}
          onChange={(e) => setSelectedJournalistId(e.target.value)}
        >
          <option value="">All Journalists</option>
          {/* Render journalist options */}
          {journalists.map((j) => (
            <option key={j.id} value={j.id}>
              {j.name || `Journalist #${j.id}`}
            </option>
          ))}
        </select>

        <button onClick={applyFilter}>Apply Filters</button>
        <button onClick={resetFilter}>Reset Filters</button>
      </div>

      <ul>
        {/* Render filtered articles */}
        {filteredArticles.map(article => (
          <li key={article.id}>
            <strong>{article.title}</strong> <br />
            <small>By Journalist #{article.journalistId} | Category #{article.categoryId}</small><br />
            <button disabled>Delete</button>
            <button disabled>Update</button>
            <button disabled>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
