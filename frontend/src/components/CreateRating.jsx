import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

function CreateRating() {
  const [title, setTitle] = useState("");
  const [popularity, setPopularity] = useState("");
  const [voteAverage, setVoteAverage] = useState("");
  const [voteCount, setVoteCount] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Rating must have a movie title!");
      return;
    }

    const parsedPopularity = parseFloat(popularity) || 0;
    const parsedVoteAverage = parseFloat(voteAverage) || 0;
    const parsedVoteCount = parseInt(voteCount, 10) || 0;

    if (parsedVoteAverage < 0 || parsedVoteAverage > 10) {
      alert("Vote average must be between 0 and 10.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json",
                  'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: Date.now(),
          title: title,
          popularity: parsedPopularity,
          vote_average: parsedVoteAverage,
          vote_count: parsedVoteCount,
        }),
      });

      if (response.ok) {
        alert("Rating created successfully!");
        navigate("/movies");
      } else {
        const text = await response.text();
        alert("Error creating rating: " + text);
      }
    } catch (error) {
      console.error("Network error", error);
      alert("Network error: " + error.message);
    }
  };

  return (
    <div>
      <h2>Create New Rating</h2>
      <form onSubmit={handleSubmit} className="formContainer">
        <div>
          <label>Movie Title:</label>
          <input
            type="text"
            className="inputField"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
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
          Create Rating
        </Button>
      </form>
    </div>
  );
}

export default CreateRating;
