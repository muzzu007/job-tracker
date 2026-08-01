import { Link } from "react-router-dom";
import "../stylesheet/Home.css";

function Home() {
    return (
        <div className="home">

            <section className="hero">

                <h1>Job Tracker</h1>

                <p>
                    Keep track of your job applications,
                    interviews and offers in one place.
                </p>

                <div className="hero-buttons">

                    <Link to="/login">
                        <button className="login-btn">
                            Login
                        </button>
                    </Link>

                    <Link to="/register">
                        <button className="register-btn">
                            Register
                        </button>
                    </Link>

                </div>

            </section>

            <section className="features">

                <div className="feature-card">
                    <h2>📋 Track Jobs</h2>
                    <p>
                        Save every application with company,
                        role and notes.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>🔍 Search</h2>
                    <p>
                        Find applications instantly using
                        search and filters.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>📈 Manage Status</h2>
                    <p>
                        Applied, Interview, Offer or Rejected.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>🔐 Secure</h2>
                    <p>
                        Authentication keeps your data safe.
                    </p>
                </div>

            </section>

            <footer>
                <p>
                    Built with MongoDB • Express • React • Node.js
                </p>
            </footer>

        </div>
    );
}

export default Home;