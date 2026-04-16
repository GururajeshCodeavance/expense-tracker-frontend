import React, { useState } from "react";
import axios from "axios";

const AddExpense = () => {
const [formData, setFormData] = useState({
title: "",
amount: "",
category: "",
date: ""
});

const [errors, setErrors] = useState({});
const [success, setSuccess] = useState("");
const categories = ["Food", "Travel", "Shopping", "Bills", "Subscription", "Internet", "Medicine","Recharge", "Other"];

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value
});
};

const validateForm = () => {
let newErrors = {};

// TITLE VALIDATION
if (!formData.title || formData.title.trim() === "") {
newErrors.title = "Title is required";
} else {
const titleRegex = /^[A-Za-z\s]+$/;
if (!titleRegex.test(formData.title.trim())) {
newErrors.title = "Title must contain only alphabets";
} else if (formData.title.trim().length < 3) {
newErrors.title = "Title must be at least 3 characters";
}
}

// AMOUNT VALIDATION
if (!formData.amount) {
newErrors.amount = "Amount is required";
} else if (isNaN(formData.amount)) {
newErrors.amount = "Amount must be a number";
} else if (Number(formData.amount) <= 0) {
newErrors.amount = "Amount must be greater than 0";
}

// CATEGORY VALIDATION
if (!formData.category) {
newErrors.category = "Category is required";
}

// DATE VALIDATION
if (!formData.date) {
  newErrors.date = "Date is required";
} else {
  const today = new Date().toLocaleDateString("en-CA");

  if (formData.date > today) {
    newErrors.date = "Future date not allowed";
  }
}

return newErrors;
};


const handleSubmit = async (e) => {
e.preventDefault();
const validationErrors = validateForm();

if (Object.keys(validationErrors).length > 0) {
  setErrors(validationErrors);
  return;
}

try {
  const token = localStorage.getItem("token");

  await axios.post("http://127.0.0.1:8000/expenses", formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  setSuccess("Expense added successfully!");
  setTimeout(() => setSuccess(""), 2000);

  setFormData({
    title: "",
    amount: "",
    category: "",
    date: ""
  });

  setErrors({});
} catch (err) {
  console.error(err);
  setErrors("Failed to add expense");
}
};
return (
<div className="page-wrapper">
  <div className="page-content">

<div> <h2>Add Expense</h2></div>
  {success && <div style={styles.success}>{success}</div>}
  {errors.general && <div style={styles.error}>{errors.general}</div>}

 <form onSubmit={handleSubmit} style={styles.form}> 
   <div style={styles.field}>
     <input
      type="text"
      name="title"
      placeholder="Expense Title"
      value={formData.title}
      onChange={handleChange}
      style={styles.input}
      />
      {errors.title && <span style={styles.errorText}>{errors.title}</span>}
    </div>
      <div style={styles.field}>
        <input type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        style={styles.input}
        />
       {errors.amount && <span style={styles.errorText}>{errors.amount}</span>}
     </div> 
     <div style={styles.field}>
       <select name="category"
       value={formData.category}
       onChange={handleChange}
       style={styles.input} 
       >
       <option value="">Select Category</option> 
       {categories.map((cat, index) => ( 
       <option key={index} value={cat}>{cat}</option> 
       ))} 
       </select> 
       {errors.category && <span style={styles.errorText}>{errors.category}</span>} 
      </div> 
        <div style={styles.field}> 
        <input type="date"
        name="date"
        value={formData.date}
        onChange={handleChange} 
        style={styles.input}
        max={new Date().toLocaleDateString("en-CA")}
        />
        {errors.date && <span style={styles.errorText}>{errors.date}</span>}
      </div>
      <button type="submit" style={styles.button}>
          Add Expense 
      </button>


  </form>
</div>
</div>

);
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  heading: {
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  field: {
    display: "flex",
    flexDirection: "column"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  errorText: {
    color: "red",
    fontSize: "12px",
    marginTop: "5px"
  },
  error: {
    background: "#ffebee",
    color: "#c62828",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px"
  },
  success: {
    background: "#e8f5e9",
    color: "#2e7d32",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px"
  }
};

export default AddExpense;
