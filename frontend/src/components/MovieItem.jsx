import Button from "./Button";
import { useNavigate } from "react-router-dom";

const MovieItem = (props) => {
    const { movie, DeleteMovie } = props;
    const navigate = useNavigate();

    return (
        <div className="movie">
            <h3>{movie.title}</h3>
            <p>
                <strong>Genre:</strong> {movie.genres.join(", ")}
            </p>
            <p>
                <strong>Release Year:</strong> {movie.release_year}
            </p>

            <Button text="Delete" className="btn-delete" onClick={() => DeleteMovie(movie._id)} />
            <Button text="Edit" className="btn-edit" onClick={() => navigate(`/edit/${movie._id}`)} />
            <Button text="Details" className="btn-details" onClick={() => navigate(`/movies/${movie._id}`)} />
        </div>
    );
}

export default MovieItem;
