// src/components/ArticleFilter.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export default function ArticleFilter() {
  const [articles, setArticles] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedJournalist, setSelectedJournalist] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Q1: Fetch all journalists and categories on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [journalistsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/journalists`),
          axios.get(`${API_URL}/categories`),
        ]);
        setJournalists(journalistsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError("Failed to fetch filter options.");
        console.error('Error fetching dropdown data:', err);
      }
    };
    fetchDropdownData();
  }, []);

  // Q2, Q3, Q4: Fetch articles based on selected filters (server-side)
  // This useEffect will run whenever selectedJournalist or selectedCategory changes
  useEffect(() => {
    const fetchFilteredArticles = async () => {
      setLoading(true);
      setError(null);
      
      let apiUrl = `${API_URL}/articles`;
      const params = {};

      if (selectedJournalist) {
        params.journalistId = selectedJournalist;
      }
      
      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }

      try {
        const res = await axios.get(apiUrl, { params });
        setArticles(res.data);
      } catch (err) {
        setError("Failed to fetch articles. Please check the backend server and API routes.");
        console.error('Error fetching filtered articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredArticles();
  }, [selectedJournalist, selectedCategory]);

  const handleResetFilters = () => {
    setSelectedJournalist('');
    setSelectedCategory('');
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Filter Articles</h2>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <label htmlFor="journalistFilter" className="font-medium text-gray-700">Filter by Journalist:</label>
        <select
          id="journalistFilter"
          value={selectedJournalist}
          onChange={(e) => setSelectedJournalist(e.target.value)}
          className="p-2 border rounded-md shadow-sm"
        >
          <option value="">All Journalists</option>
          {journalists.map(j => (
            <option key={j.id} value={j.id}>{j.name || `Journalist #${j.id}`}</option>
          ))}
        </select>

        <label htmlFor="categoryFilter" className="font-medium text-gray-700">Filter by Category:</label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md shadow-sm"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name || `Category #${c.id}`}</option>
          ))}
        </select>
        
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300 transition duration-300"
        >
          Reset Filters
        </button>
      </div>

      {loading && <p className="text-center text-gray-600">Loading articles...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && articles.length === 0 && (
        <p className="text-center text-gray-600">No articles found with the selected filters.</p>
      )}
      
      {!loading && !error && articles.length > 0 && (
        <ul className="space-y-4">
          {articles.map(article => (
            <li key={article.id} className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-indigo-500">
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <small className="text-gray-500">By Journalist #{article.journalistId} | Category #{article.categoryId}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}