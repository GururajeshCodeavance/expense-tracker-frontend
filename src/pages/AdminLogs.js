import { useEffect, useState } from "react";


export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");

       let url = `http://127.0.0.1:8000/admin/logs?skip=${(page - 1) * limit}&limit=${limit}`;

          if (filterAction) {
            url += `&action=${filterAction}`;
          }

         const res = await fetch(url, {
           headers: {
            Authorization: `Bearer ${token}`,
         },
         });

        if (!res.ok) {
          throw new Error("Not authorized or failed");
        }

        const data = await res.json();
        setLogs(data.data || []);
        setTotal(data.total || 0);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchLogs();
  }, [filterAction, page]);

  useEffect(() => {
  setPage(1);
}, [filterAction]);


const thStyle = {
  textAlign: "left",
  padding: "12px",
  fontSize: "14px",
  fontWeight: "600"
};

const tdStyle = {
  padding: "12px",
  fontSize: "14px"
};

const getBadgeStyle = (action) => {
  let bg = "#7f8c8d"; // default

  if (action === "LOGIN") bg = "#3498db";
  if (action === "ADD_EXPENSE") bg = "#2ecc71";
  if (action === "DELETE_EXPENSE") bg = "#e74c3c";
  if (action === "UPDATE_EXPENSE") bg = "#f39c12";

  return {
    background: bg,
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block"
  };
};

const btnStyle = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#4a69bd",
  color: "#fff",
  cursor: "pointer"
};

 return (
  <div style={{
    padding: "30px",
    background: "#f5f7fb",
    minHeight: "100vh"
  }}>
    <div style={{
      background: "#fff",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
    }}>

      <h2 style={{ marginBottom: "20px" }}>
        Activity Logs 📊
      </h2>

      {error && (
        <p style={{ color: "red", marginBottom: "10px" }}>
        {error}
        </p>
        )}

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <div>
          <label style={{ fontWeight: "500" }}>Filter:</label>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            style={{
              padding: "5px",
              marginLeft: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          >
            <option value="">All</option>
            <option value="LOGIN">Login</option>
            <option value="ADD_EXPENSE">Add Expense</option>
            <option value="DELETE_EXPENSE">Delete Expense</option>
            <option value="UPDATE_EXPENSE">Update Expense</option>
          </select>
        </div>
      </div>

      <table style={{
          width: "100%",
          borderCollapse: "collapse",
          borderRadius: "10px",
          overflow: "hidden"
         }}>
        <thead style={{ background: "#f1f3f6" }}>
        <tr>
           <th style={thStyle}>User Email</th>
           <th style={thStyle}>Action</th>
           <th style={thStyle}>Description</th>
           <th style={thStyle}>Time</th>
        </tr>
        </thead>

       <tbody>
  {logs.map((log, index) => (
    <tr
      key={index}
      style={{
        borderBottom: "1px solid #eee",
        transition: "0.2s"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fbff")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td style={tdStyle}>{log.email}</td>

      <td style={tdStyle}>
        <span style={getBadgeStyle(log.action)}>
          {log.action}
        </span>
      </td>

      <td style={tdStyle}>{log.description}</td>

      <td style={tdStyle}>
        {new Date(log.time).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: true,
        })}
      </td>
    </tr>
  ))}
</tbody>
      </table>

      <div style={{
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px"
}}>
  <button
    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
    disabled={page === 1}
    style={btnStyle}
  >
    Prev
  </button>

  <span>
    Page {page} of {totalPages || 1}
  </span>

  <button
    onClick={() => setPage(prev => prev + 1)}
    disabled={page >= totalPages}
    style={btnStyle}
  >
    Next
  </button>
</div>

    </div>
  </div>
);
}


