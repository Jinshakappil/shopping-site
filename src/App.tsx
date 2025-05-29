
import "./App.css";
import LoginForm from "./Login/login";
import Cart from "./cart/cart";
import { Routes, Route,Navigate  } from "react-router-dom";
import RegisterForm from "./Register/Register";

function App() {
  return (
    <div>
      <Routes>
           <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </div>
  );
}

export default App;
