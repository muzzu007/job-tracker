import { Link } from "react-router-dom";
import "../stylesheet/NotFound.css";

function NotFound() {
    return (
        <div className="not-found">
            <h1>404</h1>

            <h2>Page Not Found</h2>

            <p>
                The page you are looking for doesn't exist.
            </p>

            <Link to="/login">
                Go to Login
            </Link>
        </div>
    );
}

export default NotFound;