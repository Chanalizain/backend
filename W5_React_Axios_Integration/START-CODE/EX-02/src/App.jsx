// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import ArticleFilter from './components/ArticleFilter.jsx';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans antialiased text-gray-800">
      <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
          📰 News Article Filter
        </h1>
        
        <Routes>
          <Route path="/" element={<ArticleFilter />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
