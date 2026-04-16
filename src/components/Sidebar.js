

export default function Sidebar({ setPage }) {
  return (
    <div style={styles.sidebar}>
      <h2>💰 Expense</h2>

      <button onClick={() => setPage("dashboard")}>Dashboard</button>
      <button onClick={() => setPage("add")}>Add Expense</button>
      <button onClick={() => setPage("list")}>Expense List</button>
      <button onClick={() => setPage("reports")}>Reports</button>
      <button onClick={() => setPage("logs")}>Activity Logs</button>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        style={styles.logout}
      >
        Logout
      </button>
    </div>
  
    
  );
}

const styles = {
  sidebar: {
    width: "200px",
    height: "100vh",
    background: "#1e293b",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    gap: "10px",
  },
  button: {
  background: "#334155",
  color: "white",
  border: "none",
},


};