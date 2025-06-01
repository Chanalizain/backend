import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ArticleForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    content: '',
    journalistId: '',
    categoryId: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //stop page reload 
    // Validate form data
    if (!form.title || !form.content || !form.journalistId || !form.categoryId) {
      setError('Please fill in all fields.');
      setSuccess('');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/articles', {
        title: form.title,
        content: form.content,
        journalistId: parseInt(form.journalistId),  
        categoryId: parseInt(form.categoryId),      
      });
      setSuccess('Article created successfully!');
      setError('');
      // Optionally reset form
      setForm({
        title: '',
        content: '',
        journalistId: '',
        categoryId: '',
      });
    } catch (err) {
      setError('Failed to create article. Please try again.');
      setSuccess('');
    }
  };

  return (

    <div>
      {/* Navigation Links */}
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>📄 View Articles</Link>
        <Link to="/add"> ➕ Add Article</Link>
      </nav>

      <h2>Articles</h2>
      <form onSubmit={handleSubmit}>
        <h3>Add New Article</h3>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required /><br />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" required /><br />
        <input name="journalistId" value={form.journalistId} onChange={handleChange} placeholder="Journalist ID" required /><br />
        <input name="categoryId" value={form.categoryId} onChange={handleChange} placeholder="Category ID" required /><br />
        <button type="submit">Add</button>
      </form>

    </div>
  );
}
