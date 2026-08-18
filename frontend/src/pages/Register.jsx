import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheet/Register.css"
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Register() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    //Handle Input Change
    function handleChange(event) {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });

    }

    //Handle Submission
    async function handleSubmit() {
        try {
            if (!formData.name.trim()) {
                toast.error("Name is required");
                return;
            }

            if (!formData.email.trim()) {
                toast.error("Email is required");
                return;
            }

            if (!formData.password) {
                toast.error("Password is required");
                return;
            }
            setLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );


            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message);
                return;
            }


            toast.success(data.message ||
                "Registration successful");

            navigate("/login");
        } catch (error) {
            toast.error("Unable to connect to server");
        } finally {
            setLoading(false);
        }

    }


    return (
        <div className="register-container">

            <div className="register-card">
                <h1>Create Account</h1>
                <input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />


                <input
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />


                <div className="password-field">

                    <input
                        name="password"
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>

                </div>


                <button
                    className="auth-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Creating Account..." : "Register"}
                </button>
                <button className="login-link" onClick={() => navigate("/login")}>
                    Already have an account? Login
                </button>


            </div>
        </div>
    )

}

export default Register;
