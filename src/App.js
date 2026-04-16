import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );

  const [showLogin, setShowLogin] = useState(true);

  if (!isLoggedIn) {
    return showLogin ? (
      <Login setIsLoggedIn={setIsLoggedIn} setShowLogin={setShowLogin} />
    ) : (
      <Register setShowLogin={setShowLogin} />
    );
  }

 return (
  <div className="layout">
    <Dashboard />
  </div>
);
}

export default App;