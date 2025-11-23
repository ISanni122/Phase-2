import Button from "./Button";

const MovieItem = (props) => {
    const { movie, DeleteMovie } = props;
    return (
        <div className="movie">
            <h3>{movie.title}</h3>
            <p>
                <strong>Genre:</strong> {movie.genres.join(", ")}
            </p>
            <p>
                <strong>Release Year</strong> {movie.release_year}
            </p>
            <Button text="Delete" className="btn-delete" onClick={() => DeleteMovie(movie._id)} />
        </div>
    );
}

export default MovieItem;