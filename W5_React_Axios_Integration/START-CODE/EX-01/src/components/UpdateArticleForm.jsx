import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

//Q4 – Update Existing Article
export default function UpdateArticleForm() {
  const { id } = useParams();  // get article ID from route params

  const [form, setForm] = useState({
    title: '',
    content: '',
    journalistId: '',
    categoryId: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch article data to prefill form
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/articles/${id}`);
        setForm({
          title: res.data.title,
          content: res.data.content,
          journalistId: res.data.journalistId,
          categoryId: res.data.categoryId,
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch article.');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    //update aticle with axios
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!form.title || !form.content || !form.journalistId || !form.categoryId) {
      setError('Please fill all fields.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/articles/${id}`, form);
      setSuccess('Article updated successfully!');
    } catch (err) {
      setError('Failed to update article.');
    }
  };

  if (loading) return <div>Loading article...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h3>Update Article</h3>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required /><br />
      <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" required /><br />
      <input name="journalistId" value={form.journalistId} onChange={handleChange} placeholder="Journalist ID" required /><br />
      <input name="categoryId" value={form.categoryId} onChange={handleChange} placeholder="Category ID" required /><br />
      <button type="submit">Update</button>
    </form>
  );
}
