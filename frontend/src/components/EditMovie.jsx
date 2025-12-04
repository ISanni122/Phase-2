import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from './Button';

function EditMovie() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [Movietitle, setTitle] = useState('');
    const [Moviegenre, setGenre] = useState('');
    const [MovieReleaseYear, setReleaseYear] = useState('');
    const [MovieOverview, setOverview] = useState('');
    const [MovieBudget, setBudget] = useState('');
    const [MovieRevenue, setRevenue] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMovie() {
            try {
                const token = localStorage.getItem("token");
                const resp = await fetch(`http://localhost:3000/movies/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!resp.ok) throw new Error('Failed to fetch movie');

                const movie = await resp.json();
                setTitle(movie.title);
                setGenre(movie.genres.join(", "));
                setReleaseYear(movie.release_year);
                setOverview(movie.overview);
                setBudget(movie.budget);
                setRevenue(movie.revenue);
                setLoading(false);
            } catch (err) {
                alert(err.message);
            }
        }

        fetchMovie();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const releaseYear = parseInt(MovieReleaseYear, 10);

        const updatedMovie = {
            title: Movietitle,
            genres: Moviegenre, // backend handles splitting
            release_year: releaseYear,
            overview: MovieOverview,
            budget: MovieBudget ? parseFloat(MovieBudget) : 0,
            revenue: MovieRevenue ? parseFloat(MovieRevenue) : 0,
        };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/movies/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedMovie),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || 'Error updating movie or you do not have the permission to create');
                return;
            }

            alert('Movie updated successfully!');
            navigate('/movies');
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p>Loading movie data...</p>;

    return (
        <div>
            <h2>Edit Movie</h2>
            <form onSubmit={handleSubmit} className="formContainer">
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        className="inputField"
                        value={Movietitle}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label>Genre:</label>
                    <input
                        type="text"
                        className="inputField"
                        value={Moviegenre}
                        onChange={(e) => setGenre(e.target.value)}
                    />
                </div>

                <div>
                    <label>Release Year:</label>
                    <input
                        type="number"
                        className="inputField"
                        value={MovieReleaseYear}
                        onChange={(e) => setReleaseYear(e.target.value)}
                    />
                </div>

                <div>
                    <label>Overview:</label>
                    <textarea
                        className="inputField"
                        value={MovieOverview}
                        onChange={(e) => setOverview(e.target.value)}
                    />
                </div>

                <div>
                    <label>Budget:</label>
                    <input
                        type="number"
                        className="inputField"
                        value={MovieBudget}
                        onChange={(e) => setBudget(e.target.value)}
                    />
                </div>

                <div>
                    <label>Revenue:</label>
                    <input
                        type="number"
                        className="inputField"
                        value={MovieRevenue}
                        onChange={(e) => setRevenue(e.target.value)}
                    />
                </div>

                <Button type="submit" className="btn">Update Movie</Button>
            </form>
        </div>
    );
}

export default EditMovie;
