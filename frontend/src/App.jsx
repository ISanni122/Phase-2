// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListMovies from './components/ListMovies';
import CreateMovie from './components/CreateMovie';
import './App.css';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#f4f4f4' }}>
        <Link to="/">Home</Link> | <Link to="/create">Add New Movie</Link>
      </nav>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<ListMovies />} />
          <Route path="/create" element={<CreateMovie />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;