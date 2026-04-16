import { useEffect, useState, useCallback } from "react";

export default function ExpenseList() {
const [selectedCategory, setSelectedCategory] = useState("");  
const [expenses, setExpenses] = useState([]);
const [error, setError] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [page, setPage] = useState(1);
const limit = 5; // items per page
const [total, setTotal] = useState(0);
const totalPages = total === 0 ? 1 : Math.ceil(total / limit);
const [editingExpense, setEditingExpense] = useState(null);
const [editAmount, setEditAmount] = useState("");
const [editingId, setEditingId] = useState(null);
const [toast, setToast] = useState("");
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const fetchExpenses = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");


    let url = `http://127.0.0.1:8000/expenses?skip=${(page - 1) * limit}&limit=${limit}`;

    if (selectedCategory) url += `&category=${selectedCategory.toLowerCase()}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    setExpenses(data.data || []);
    setTotal(data.total || 0);

  } catch (err) {
    console.error(err);
    setError("Something went wrong while fetching data");
  }
}, [selectedCategory, startDate, endDate, page]); 

useEffect(() => {
  fetchExpenses();
}, [fetchExpenses]);

useEffect(() => {
  setPage(1);
}, [selectedCategory, startDate, endDate]);

const handleDelete = async () => {

  try {
    const token = localStorage.getItem("token");

    await fetch(`http://127.0.0.1:8000/expenses/${deleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    setShowDeleteModal(false);
    setDeleteId(null);
    fetchExpenses();
    setToast("Expense deleted successfully ✅");
    setTimeout(() => setToast(""), 3000);

  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};

const handleUpdate = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const exp = expenses.find(e => e.id === id);

    const response = await fetch(`http://127.0.0.1:8000/expenses/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: exp.title,
        amount: Number(editAmount),
        category: exp.category,
        date: exp.date,
      }),
    });

    const data = await response.json();
    console.log("UPDATE RESPONSE:", data);

    setEditingId(null);
    fetchExpenses();
    setToast("Expense updated successfully ✅");
    setTimeout(() => setToast(""), 3000);

  } catch (err) {
    console.error(err);
    alert("update failed")
  }
};

return (
  <div style={{
    padding: "20px",
    background: "#f5f6fa",
    minHeight: "100vh"
  }}>

    {/* ✅ CARD START */}
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}></div>

<h2 style={{ marginBottom: "15px" }}>
  Expense List 📋
</h2>
{toast && (
  <div style={styles.toast}>
    {toast}
  </div>
)}

  {error && <p style={{ color: "red" }}>{error}</p>}

  <div style={{
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  alignItems: "center"
}}>
   <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    style={{
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc"
    }}
  >
    <option value="">All Categories</option>
  <option value="food">Food</option>
    <option value="travel">Travel</option>
    <option value="shopping">Shopping</option>
    <option value="bills">Bills</option>
    <option value="subscription">Subscription</option>
    <option value="internet">Internet</option>
    <option value="medicine">Medicine</option>
    <option value="recharge">Recharge</option>
    <option value="other">Other</option>
  </select>
  <input type="date" onChange={(e) => setStartDate(e.target.value)} />
  <input type="date" onChange={(e) => setEndDate(e.target.value)} />

</div>
{editingExpense && (
  <div>
    <input
      value={editingExpense.title}
      onChange={(e) =>
        setEditingExpense({ ...editingExpense, title: e.target.value })
      }
    />

    <button onClick={handleUpdate}>Update</button>
  </div>
)}

  <table style={{
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px"
}}>
    <thead>
      <tr>
        <th style={{
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  color: "#555",
  fontWeight: "600"
}}>
  Title
</th>
        <th style={{
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  color: "#555",
  fontWeight: "600"
}}>
  Amount
</th>
        <th style={{
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  color: "#555",
  fontWeight: "600"
}}>
  Category
</th>
        <th style={{
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  color: "#555",
  fontWeight: "600"
}}>
  Date
</th>
        <th style={{
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  color: "#555",
  fontWeight: "600"
}}>
  Action
</th>
      </tr>
    </thead>

    <tbody>
      {Array.isArray(expenses) && expenses.length > 0 ? (
        expenses.map((exp) => (
          <tr key={exp.id}>
            <td>{exp.title}</td>
            <td>{editingId === exp.id ? (
                <input
                 type="number"
                 value={editAmount}
                 onChange={(e) => setEditAmount(e.target.value)}
                 />
                ) : (
                 `₹${exp.amount}`
            )}</td>
            <td>{exp.category ? exp.category.charAt(0).toUpperCase() + exp.category.slice(1) : "N/A"}
            </td>
            <td>{exp.date}</td>
           <td>
  {editingId === exp.id ? (
    <>
      <button onClick={() => handleUpdate(exp.id)}>Save</button>
      <button onClick={() => setEditingId(null)}>Cancel</button>

    </>
  ) : (
    <>
      <button
        onClick={() => {
          setEditingId(exp.id);
          setEditAmount(exp.amount);
        }}
         >
          Edit
      </button>
      <button onClick={() => {
          setDeleteId(exp.id);
          setShowDeleteModal(true);
        }}>
           Delete
      </button>
         </>
          )}
          </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5">No expenses found</td>
        </tr>
      )}
    </tbody>
  </table>
     <div style={{ marginTop: "20px" }}>
        <button 
           onClick={() => setPage(prev => Math.max(prev - 1, 1))}
           disabled={page === 1}
           >
        Prev
        </button>
        <span style={{ margin: "0 10px" }}>
        Page {page} of {totalPages}
        </span>
        <button 
           onClick={() => setPage(prev => prev + 1)}
           disabled={page >= totalPages}
           >
        Next
        </button>
      </div>

      {showDeleteModal && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}>
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      width: "300px",
      textAlign: "center"
    }}>
      <h3>Delete Expense</h3>
      <p>Are you sure you want to delete?</p>

      <div style={{ marginTop: "15px" }}>
        <button onClick={handleDelete} style={{
          background: "red",
          color: "#fff",
          marginRight: "10px",
          padding: "8px 12px",
          border: "none",
          borderRadius: "5px"
        }}>
          Delete
        </button>

        <button onClick={() => setShowDeleteModal(false)} style={{
          padding: "8px 12px",
          borderRadius: "5px"
        }}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
</div>
);
}
const styles = {
container: {
padding: "20px"
},
table: {
width: "100%",
borderCollapse: "collapse",
marginTop: "20px",
background: "#fff",
borderRadius: "8px",
overflow: "hidden"
},
th: {
background: "#f5f5f5",
padding: "12px",
textAlign: "left",
borderBottom: "2px solid #ddd"
},
td: {
padding: "10px",
borderBottom: "1px solid #eee"
},
rowHover: {
cursor: "pointer"
},
toast: {
background: "#4CAF50",
color: "#fff",
padding: "10px 20px",
borderRadius: "5px",
marginBottom: "10px",
display: "inline-block"
}
};

