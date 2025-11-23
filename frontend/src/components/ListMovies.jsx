import MovieItem from "./MovieItem";
import { useEffect, useState } from "react";

const ListMovies = (props) => {
  
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState([]);

  const DeleteMovie = async (id) => {
    if (!id) return;
    try {
      const resp = await fetch(`http://localhost:3000/movies/${id}`, {
        method: 'DELETE',
      });
      if (!resp.ok) {
        throw new Error(`Failed to delete movie (status ${resp.status})`);
      }
      setData((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      setError(err.message || 'Delete failed');
    }
  };


useEffect(() => {
  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/movies");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        const result = await response.json();
        setData(Array.isArray(result) ? result : result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
}, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load Movies</div>;

  return (
    <div id="container">
      {data.map((movie, index) => (
        <MovieItem
          key={movie._id || index}
          movie={movie}
          DeleteMovie={DeleteMovie}
        />
      ))}
    </div>
  );
};

export default ListMovies;