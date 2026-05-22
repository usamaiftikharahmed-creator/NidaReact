import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },

        onSubmit: async (values) => {
            try {

                const res = await fetch("https://nidareact-production.up.railway.app/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: values.username.trim(),
                        password: values.password
                    })
                });

                const data = await res.json();

                console.log("LOGIN RESPONSE:", data);

                if (data.success) {

                    // 👑 ADMIN LOGIN
                    if (data.role === "admin") {
                        alert("Welcome Admin 👑");
                        navigate("/admin");   // ✅ FIXED (lowercase)
                    }

                    // 👤 USER LOGIN
                    else {
                        alert("Login Successful");
                        navigate("/home");
                    }

                } else {
                    alert(data.message || "Login failed");
                }

            } catch (err) {
                console.log(err);
                alert("Server error");
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
                    background: linear-gradient(135deg, #667eea, #764ba2);
                }

                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }

                .login-card {
                    background: #fff;
                    padding: 40px 30px;
                    border-radius: 12px;
                    width: 360px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    animation: fadeIn 0.5s ease-in-out;
                }

                .login-card h1 {
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
                    border-color: #667eea;
                    outline: none;
                    box-shadow: 0 0 5px rgba(102, 126, 234, 0.5);
                }

                .submit-btn {
                    width: 100%;
                    padding: 12px;
                    background: #667eea;
                    border: none;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 16px;
                    cursor: pointer;
                    transition: 0.3s;
                    margin-top: 10px;
                }

                .submit-btn:hover {
                    background: #5563d6;
                }

                .signup-link {
                    text-align: center;
                    margin-top: 18px;
                    font-size: 14px;
                    color: #666;
                }

                .signup-link a {
                    color: #667eea;
                    text-decoration: none;
                    font-weight: 600;
                }

                .signup-link a:hover {
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

            <div className="login-container">
                <div className="login-card">
                    <h1>Welcome Back</h1>

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
                            Login
                        </button>

                        <div className="signup-link">
                            Don’t have an account? <Link to="/">Sign up</Link>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}
