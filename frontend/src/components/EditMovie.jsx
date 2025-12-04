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

    // Load movie on first render
    useEffect(() => {
        async function fetchMovie() {
            const resp = await fetch(`http://localhost:3000/movies/${id}`);
            const movie = await resp.json();

            setTitle(movie.title);
            setGenre(movie.genres.join(", "));
            setReleaseYear(movie.release_year);
            setOverview(movie.overview);
            setBudget(movie.budget);
            setRevenue(movie.revenue);
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

        const response = await fetch(`http://localhost:3000/movies/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedMovie),
        });

        if (response.ok) {
            alert('Movie updated successfully!');
            navigate('/');
        } else {
            alert('Error updating movie');
        }
    };

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
