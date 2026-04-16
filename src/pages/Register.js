import { useState } from "react";
import "./../styles/Auth.css";

export default function Register({ setShowLogin }) {
  const [name, setName] = useState("");
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

  const handleRegister = async () => {
    setError("");
    setMessage("");

    if (!name || !email || !password) {
       showMessage("error", "Please fill all fields");
       return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("success", "Registered Successfully ✅");

        setTimeout(() => {
          setShowLogin(true); // go back to login
        }, 1000);
      } else {
        const errorMsg = typeof data.detail === "string"? data.detail: data.detail?.[0]?.msg || "Registration failed ❌";
        showMessage("error", errorMsg);  
      }
    } catch (err) {
      showMessage("error", "Server error 🚨");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 className="auth-title">Create Account 🚀</h2>
          <p className="auth-subtitle">
            Start managing your expenses smarter
           </p>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleRegister} style={styles.button}>
          Register
        </button>

        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <span
            onClick={() => setShowLogin(true)}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Login
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
    background: "#28a745",
    color: "white",
    border: "none",
  },
};