import {useState} from 'react'; 
import {useNavigate} from 'react-router-dom';
import Button from './Button';

function CreateMovie() {
    const [Movietitle, setTitle] = useState('');
    const [Moviegenre, setGenre] = useState('');
    const [MovieReleaseYear, setReleaseYear] = useState('');
    const [MovieOverview, setOverview] = useState('');
    const [MovieBudget, setBudget] = useState('');
    const [MovieRevenue, setRevenue] = useState('');
    const navigate = useNavigate();

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleGenreChange = (e) => setGenre(e.target.value);
    const handleReleaseYearChange = (e) => setReleaseYear(e.target.value);
    const handleOverviewChange = (e) => setOverview(e.target.value);
    const handleBudgetChange = (e) => setBudget(e.target.value);
    const handleRevenueChange = (e) => setRevenue(e.target.value);

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Movietitle || !Moviegenre || !MovieReleaseYear || !MovieOverview) {
        alert('The movie needs a title, genre, release year, and overview!');
        return;
    }

    const releaseYear = parseInt(MovieReleaseYear, 10);
    if (isNaN(releaseYear) || releaseYear < 1888 || releaseYear > new Date().getFullYear()) {
        alert('Please enter a valid release year');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/movies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: Movietitle,
                genres: Moviegenre,
                release_year: releaseYear,
                overview: MovieOverview,
                budget: MovieBudget ? parseFloat(MovieBudget) : 0,
                revenue: MovieRevenue ? parseFloat(MovieRevenue) : 0,
            }),
        });

        if (response.ok) {
            alert('Movie created successfully!');
            navigate('/');
        } else {
            const text = await response.text();
            alert('Error creating movie: ' + text);
        } 
    } catch (error) {
        console.error('Network error', error);
        alert('Network error: ' + error.message);
    }
};

    return (
        <div>
            <h2>Create New Movie</h2>
            <form onSubmit={handleSubmit} className = "formContainer">
                <div>
                    <label>Title:</label>
                    <input type="text" className = "inputField" value={Movietitle} onChange={handleTitleChange} />
                </div>
                <div>
                    <label>Genre:</label>
                    <input type="text" className = "inputField" value={Moviegenre} onChange={handleGenreChange} />
                </div>
                <div>
                    <label>Release Year:</label>
                    <input type="number" className = "inputField" value={MovieReleaseYear} onChange={handleReleaseYearChange} />
                </div>
                <div>
                    <label>Overview:</label>
                    <textarea value={MovieOverview} className = "inputField" onChange={handleOverviewChange} />
                </div>
                <div>
                    <label>Budget:</label>
                    <input type="number" className = "inputField"  value={MovieBudget} onChange={handleBudgetChange} />
                </div>
                <div>
                    <label>Revenue:</label>
                    <input type="number" className = "inputField" value={MovieRevenue} onChange={handleRevenueChange} />
                </div>
                <Button type="submit" className = "btn" >Create Movie</Button>
            </form>
        </div>
    );
}

export default CreateMovie;
