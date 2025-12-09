import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingExists, setRatingExists] = useState(true);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);

      // 1️⃣ Fetch movie
      const movieRes = await fetch(`http://localhost:3000/movies/${id}`);
      const movieData = await movieRes.json();
      setMovie(movieData);

      // 2️⃣ Fetch rating by movie title
      const ratingRes = await fetch(
        `http://localhost:3000/ratings?search=${encodeURIComponent(movieData.title)}`
      );
      const ratingData = await ratingRes.json();

      if (ratingData.count > 0) {
        setRating(ratingData.data[0]);
        setRatingExists(true);
      } else {
        setRating(null);
        setRatingExists(false);
      }

      setLoading(false);
    }

    loadDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="movie-details">
      <h1>{movie.title}</h1>
      <p><strong>Genres:</strong> {movie.genres.join(", ")}</p>
      <p><strong>Release Year:</strong> {movie.release_year}</p>
      <p><strong>Overview:</strong> {movie.overview}</p>

      <h3>Rating</h3>
      {ratingExists ? (
        <>
          <p><strong>Popularity:</strong> {rating.popularity}</p>
          <p><strong>Average Vote:</strong> {rating.vote_average}</p>
          <p><strong>Vote Count:</strong> {rating.vote_count}</p>
          <button onClick={() => navigate(`/edit-rating/${encodeURIComponent(movie.title)}`)} className="btn">Edit Rating</button>
          <button onClick={() => navigate(`/movies`)} className="btn">Back</button>
        </>
      ) : (
        <div>
          <p>No rating available for this movie.</p>
          <button
            onClick={() => navigate(`/create-rating?title=${encodeURIComponent(movie.title)}`)}
            className="btn"
          >
            Create Rating
          </button>
          <button type='button' onClick={() => navigate(`/movies`)} className="btn">
            Back
          </button>
        </div>
      )}
    </div>
  );
}
