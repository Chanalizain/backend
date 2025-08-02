import { useEffect, useState } from "react";
import axios from "axios";

export default function FilterBar({ onFilterChange }) {
  const [journalists, setJournalists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedJournalistId, setSelectedJournalistId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Fetch journalists and categories on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [journalistsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:4000/api/journalists'),
          axios.get('http://localhost:4000/api/categories')
        ]);
        setJournalists(journalistsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    onFilterChange({ journalistId: selectedJournalistId, categoryId: selectedCategoryId });
  }, [selectedJournalistId, selectedCategoryId]);

  const handleReset = () => {
    setSelectedJournalistId('');
    setSelectedCategoryId('');
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="journalist-select">Journalist:</label>
        <select
          id="journalist-select"
          value={selectedJournalistId}
          onChange={(e) => setSelectedJournalistId(e.target.value)}
        >
          <option value="">All Journalists</option>
          {journalists.map(j => (
            <option key={j.id} value={j.id}>{j.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="category-select">Category:</label>
        <select
          id="category-select"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <button onClick={handleReset}>Reset Filters</button>
    </div>
  );
}
