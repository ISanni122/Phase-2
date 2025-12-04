import MovieItem from "./MovieItem";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ListMovies = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const limit = 10;
  const totalPages = Math.ceil(count / limit);

  // Fetch movies with token
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authorized. Redirecting to login...");
        setLoading(false);
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/movies?page=${page}&limit=${limit}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data || []);
        setCount(result.count || 0);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, navigate]);

  // Delete a movie
  const DeleteMovie = async (id) => {
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authorized. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      const resp = await fetch(`http://localhost:3000/movies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resp.ok) {
        throw new Error(`Failed to delete movie (status ${resp.status})`);
      }

      setData((prev) => prev.filter((m) => m._id !== id));
      setCount((prev) => prev - 1);
    } catch (err) {
      console.error(err);
      setError(err.message || "Delete failed");
    }
  };

  if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  if (error)
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        {error}
      </div>
    );

  return (
    <div>
      <div id="container" style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {data.map((movie) => (
          <MovieItem
            key={movie._id}
            movie={movie}
            DeleteMovie={DeleteMovie}
          />
        ))}
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>

        <span style={{ margin: "0 15px" }}>
          Page {page} of {totalPages || 1}
        </span>

        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ListMovies;
