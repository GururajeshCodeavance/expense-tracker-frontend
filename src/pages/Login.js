import { useState } from "react";
import "./../styles/Auth.css";

export default function Login({ setIsLoggedIn, setShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const showMessage = (type, text) => {
    if (type === "success") {
      setMessage(text);
      setError("");
    } else {
      setError(text);
      setMessage("");
    }

    setTimeout(() => {
      setMessage("");
      setError("");
    }, 1000);
  };

  const handleLogin = async () => {
    setError("");
    setMessage("");

    if (!email || !password) {
      showMessage("error", "Please enter email and password");
      return;
    }

    // EMAIL FORMAT VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     if (!emailRegex.test(email)) {
       showMessage("error", "Invalid email format ❌");
       return;
     }

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      let data;

       try {
        data = await response.json();
        } catch {
        data = {};
        }

      //  HANDLE ALL ERROR STATUS HERE
       if (!response.ok) {
        console.log("❌ Backend error:", data);
        const errorMsg =typeof data.detail === "string"? data.detail: "Invalid email or password ❌";
        showMessage("error", errorMsg);
        return;
       }

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        showMessage("success", "Login Successful ✅");

        setTimeout(() => {
          setIsLoggedIn(true);
        }, 1000);
      } else {
        showMessage("error", "Invalid email or password ❌");
      }
    } catch (err) {
      showMessage("error", "Server error 🚨");
    }
    };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 className="auth-title">Welcome Back 👋</h2>

          <p className="auth-subtitle">
            Track • Analyze • Control your expenses
            </p>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <input
          type="email"
          placeholder="📧 Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="🔒 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
        <p style={{ marginTop: "10px" }}>Don't have an account?{" "} 
        <span onClick={() => setShowLogin(false)} style={{ color: "blue", cursor: "pointer" }}> Register
         </span>
         </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
  },
  
};