import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AddExpense from "./AddExpense";
import ExpenseList from "./ExpenseList";
import Reports from "./Reports";
import {PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid} from "recharts";
import { ResponsiveContainer } from "recharts";
import AdminLogs from "./AdminLogs";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a855f7"];

export default function Dashboard() {
  const [page, setPage] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

       if (!response.ok) {
          throw new Error("Failed to fetch dashboard");
        }
      const data = await response.json();
      setDashboardData(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong 🚨");
     } finally {
    setLoading(false); // ✅ IMPORTANT
    }
  };

    fetchExpenses();
   }, []);

   const total = dashboardData?.total || 0;
   const highest = dashboardData?.highest || 0;
   const monthlyData = dashboardData?.monthly_summary || [];
   const topCategory = dashboardData?.category_breakdown?.length? dashboardData.category_breakdown.reduce((max, c) => c.total > max.total ? c : max): null;
   const sorted = [...(dashboardData?.category_breakdown || [])]
   .sort((a, b) => b.total - a.total);
   const top5 = sorted.slice(0, 4);
   const othersTotal = sorted.slice(4).reduce((sum, item) => sum + item.total, 0);
   const chartData = othersTotal > 0
    ? [...top5, { category: "Others", total: othersTotal }]
    : top5;
    let content = (
   <div>
    <h1>Dashboard 🚀</h1>

    <div style={styles.grid}>
      <div style={styles.card}>💰 Total: ₹{total}</div>
      <div style={styles.card}>📊 Monthly Expenses{monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value}`} />
            <Bar dataKey="total" fill="#4CAF50" />
            </BarChart>
            </ResponsiveContainer>
         ) : (
         <p>No monthly data</p>
         )}
        </div>
      <div style={styles.card}>🔥 Highest: ₹{highest}</div>
      <div style={styles.card}>🏆 Top Category: {topCategory ? topCategory.category : "N/A"}</div>
      <div style={styles.card}>📋 Recent Expenses:{dashboardData?.recent?.length > 0 ? (
      <ul>
      {dashboardData.recent.map((e) => (
        <li key={e.id}>
          {e.title} - ₹{e.amount}
        </li>
      ))}
      </ul>
     ) : (
     <p>No recent data</p>
     )}
     </div>

     <div style={styles.card}>📊 Category Breakdown {chartData.length > 0 ? (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
             data={chartData}
             dataKey="total"
             nameKey="category"
             outerRadius={80}
              >
            {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
         </Pie>
         <Tooltip formatter={(value) => `₹${value}`} />
         <Legend />
        </PieChart>
        </ResponsiveContainer>
             ) : (
             <p>No category data</p>
            )}
       </div>

    </div>
  
  </div>
   );

  if (page === "add") {
    content = <AddExpense />;
  }

  if (page === "list") {
    content = <ExpenseList />;
  }

  if (page === "reports") {
    content = <Reports />;
  }

  if (page === "logs") {
   content = <AdminLogs />;
  }


  if (loading) {
  return <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>⏳ Loading Dashboard...</h2>
         </div>
  }

  if (error) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🚨 {error}</h2>
    </div>
  );
}

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} />

      <div style={{ flex: 1, padding: "20px" }}>
        {content}
      </div>
    </div>
  );
}

const styles = {
  grid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
  margin: "20px 0",
   },

 card: {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
  minHeight: "300px",   // ✅ VERY IMPORTANT
  overflow: "hidden",   // ✅ prevents spill,
  },
  cardHover: {
  transform: "scale(1.02)",
  }
};