import Button from "./Button";
import {useNavigate} from "react-router-dom";

const MoviePage = (props) => {
    const {DeleteMovie} = props;
    const navigate = useNavigate();

    return (
        <main>
            <Button onClick={() => {navigate("/create")}}>Add New Movie</Button>
        </main>
    );
};

export default MoviePage;