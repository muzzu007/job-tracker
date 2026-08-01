import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheet/Login.css";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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

    //handle Submission
    async function handleSubmit() {
        try {
            setLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/login`,
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
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.user.name);
            navigate("/dashboard");

            toast.success(data.message);
        } catch (error) {
            toast.error("Unable to connect to server");
        } finally {
            setLoading(false);
        }

    }
    return (
        <div className="login-container">
          
            
            <div className="login-card">
                
                <h1>Login</h1>


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
                    {loading ? "Logging in..." : "Login"}
                </button>
                <button className="register-link" onClick={() => navigate("/register")}>
                    Create Account
                </button>


            </div>
        </div>
    )

}

export default Login