import React, { useEffect, useState } from "react";

export default function Reports() {
  const [monthly, setMonthly] = useState([]);
  const [highest, setHighest] = useState(null);
  const [category, setCategory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      // Monthly
      const mRes = await fetch("http://127.0.0.1:8000/reports/monthly", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const mData = await mRes.json();
      setMonthly(mData);

      // Highest
      const hRes = await fetch("http://127.0.0.1:8000/reports/highest", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const hData = await hRes.json();
      setHighest(hData);

      // Category
      const cRes = await fetch("http://127.0.0.1:8000/reports/category", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cData = await cRes.json();
      setCategory(cData);

    } catch (err) {
      setError("Failed to load reports");
    }
  };

  fetchReports();
}, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reports 📊</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🔹 HIGHEST */}
      <div style={styles.card}>
        <h3>Highest Expense</h3>
        {highest ? (
          <p>
            {highest.title} - ₹{highest.amount}
          </p>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* 🔹 MONTHLY */}
      <div style={styles.card}>
        <h3>Monthly Report</h3>
        {monthly.map((m, i) => (
          <p key={i}>
            {m.month} : ₹{m.total}
          </p>
        ))}
      </div>

      {/* 🔹 CATEGORY */}
      <div style={styles.card}>
        <h3>Category Report</h3>
        {category.map((c, i) => (
          <p key={i}>
            {c.category} : ₹{c.total}
          </p>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  }
};