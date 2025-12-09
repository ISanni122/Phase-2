import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "./Button";

function EditRatingByTitle() {
  const { title } = useParams();
  const navigate = useNavigate();

  const [ratingId, setRatingId] = useState(null);
  const [popularity, setPopularity] = useState("");
  const [voteAverage, setVoteAverage] = useState("");
  const [voteCount, setVoteCount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRating() {
      try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`http://localhost:3000/ratings?search=${encodeURIComponent(title)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resp.ok) throw new Error("Failed to fetch rating");

        const data = await resp.json();
        const rating = data.data?.[0]; // pick the first match

        if (!rating) {
          alert("No rating found for this movie. Consider creating one first.");
          navigate(`/create-rating?title=${encodeURIComponent(title)}`);
          return;
        }

        setRatingId(rating._id);
        setPopularity(rating.popularity);
        setVoteAverage(rating.vote_average);
        setVoteCount(rating.vote_count);
        setLoading(false);
      } catch (err) {
        alert(err.message);
      }
    }

    fetchRating();
  }, [title, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedPopularity = parseFloat(popularity) || 0;
    const parsedVoteAverage = parseFloat(voteAverage) || 0;
    const parsedVoteCount = parseInt(voteCount, 10) || 0;

    if (!ratingId) return;
    if (parsedVoteAverage < 0 || parsedVoteAverage > 10) {
      alert("Vote average must be between 0 and 10.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/ratings/${ratingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          popularity: parsedPopularity,
          vote_average: parsedVoteAverage,
          vote_count: parsedVoteCount,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Error updating rating");
        return;
      }

      alert("Rating updated successfully!");
      navigate("/movies"); // or back to movie details
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading rating data...</p>;

  return (
    <div>
      <h2>Edit Rating for "{title}"</h2>
      <form onSubmit={handleSubmit} className="formContainer">
        <div>
          <label>Popularity:</label>
          <input
            type="number"
            step="0.01"
            className="inputField"
            value={popularity}
            onChange={(e) => setPopularity(e.target.value)}
          />
        </div>
        <div>
          <label>Vote Average (0-10):</label>
          <input
            type="number"
            step="0.1"
            className="inputField"
            value={voteAverage}
            onChange={(e) => setVoteAverage(e.target.value)}
          />
        </div>
        <div>
          <label>Vote Count:</label>
          <input
            type="number"
            className="inputField"
            value={voteCount}
            onChange={(e) => setVoteCount(e.target.value)}
          />
        </div>
        <div>
          <button type='button' onClick={() => navigate(`/movies`)} className="btn">
            Back
          </button>
        </div>
        <Button type="submit" className="btn">
          Update Rating
        </Button>
      </form>
    </div>
  );
}

export default EditRatingByTitle;
