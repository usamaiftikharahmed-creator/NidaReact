import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        onSubmit: async (values) => {
            try {
                const res = await fetch("https://nidareact-production.up.railway.app/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values)
                });

                const data = await res.json();
                alert(data.message);

                // ✅ redirect to login page
                navigate("/login");

            } catch (err) {
                console.log(err);
            }
        }
    });

    return (
        <>
            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                body {
                    background: linear-gradient(135deg, #4facfe, #00f2fe);
                }

                .signup-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }

                .signup-card {
                    background: #fff;
                    padding: 40px 30px;
                    border-radius: 12px;
                    width: 360px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    animation: fadeIn 0.5s ease-in-out;
                }

                .signup-card h1 {
                    text-align: center;
                    margin-bottom: 25px;
                    color: #333;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 14px;
                    color: #555;
                }

                .form-group input {
                    width: 100%;
                    padding: 10px 12px;
                    border-radius: 6px;
                    border: 1px solid #ccc;
                    font-size: 14px;
                    transition: 0.3s;
                }

                .form-group input:focus {
                    border-color: #4facfe;
                    outline: none;
                    box-shadow: 0 0 5px rgba(79, 172, 254, 0.5);
                }

                .submit-btn {
                    width: 100%;
                    padding: 12px;
                    background: #4facfe;
                    border: none;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 16px;
                    cursor: pointer;
                    transition: 0.3s;
                    margin-top: 10px;
                }

                .submit-btn:hover {
                    background: #3a8dde;
                }

                .login-link {
                    text-align: center;
                    margin-top: 18px;
                    font-size: 14px;
                    color: #666;
                }

                .login-link a {
                    color: #4facfe;
                    text-decoration: none;
                    font-weight: 600;
                }

                .login-link a:hover {
                    text-decoration: underline;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            <div className="signup-container">
                <div className="signup-card">
                    <h1>Create Account</h1>

                    <form onSubmit={formik.handleSubmit}>
                        
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                onChange={formik.handleChange}
                                value={formik.values.username}
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn">
                            Sign Up
                        </button>

                        {/* ✅ Already have account */}
                        <div className="login-link">
                            Already have an account? <Link to="/login">Login</Link>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}
