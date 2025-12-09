import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListMovies from './components/ListMovies';
import CreateMovie from './components/CreateMovie';
import EditMovie from './components/EditMovie';
import MovieDetails from './components/DetailsPage';
import LoginPage from './components/LoginPage';
import VerifyOTP from './components/OTPverify';
import Register from './components/Register';
import CreateRating from './components/CreateRating';
import EditRating from './components/EditRating';

import './App.css';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#f4f4f4' }}>
        <Link to="/">Register</Link> |   
        <Link to="/login">Login</Link> | 
      </nav>

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/movies" element={<ListMovies />} />
          <Route path="/movies/:id" element={<MovieDetails />}/>
          <Route path="/create" element={<CreateMovie />} />
          <Route path="/edit/:id" element={<EditMovie />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/create-rating/" element={<CreateRating/>}/>
          <Route path="/edit-rating/:title" element={<EditRating/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
