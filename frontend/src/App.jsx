import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListMovies from './components/ListMovies';
import CreateMovie from './components/CreateMovie';
import EditMovie from './components/EditMovie';
import LoginPage from './components/LoginPage';
import VerifyOTP from './components/OTPverify';
import Register from './components/Register';
import './App.css';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#f4f4f4' }}>
        <Link to="/">Register</Link> |   
        <Link to="/login">Login</Link>  |
                <Link to="/create">Add New Movie</Link>  |
                <Link to="/movies">Movies</Link>

      </nav>

      <div style={{ padding: '20px' }}>
        <Routes>
          {/* 👇 Register is now the default homepage */}
          <Route path="/" element={<Register />} />

          <Route path="/movies" element={<ListMovies />} />
          <Route path="/create" element={<CreateMovie />} />
          <Route path="/edit/:id" element={<EditMovie />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
