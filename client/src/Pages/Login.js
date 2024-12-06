import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  async function login() {
    try {
      const result = await axios.post("http://localhost:8080/api/users/login", {
        email,
        password,
      });

      const { user: userData, token } = result.data;
      const userWithToken = { ...userData, token };
      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));

      alert("Logged in Successfully!");
      navigate("/home"); // Redirect to Home page after login
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
      alert("Login failed. Please try again.");
    }
  }

  return (
    <div>
      <div className="row justify-content-center align-items-center mt-5">
        <div className="col-md-5">
          <div className="bs">
            <h2>Login</h2>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary w-100 mt-3" onClick={login}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
