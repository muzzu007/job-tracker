import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";





function App() {
   return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <Login/>
            
            
          }
        />

        <Route
          path="/register"
          element={
            <Register/>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
}
        />

       <Route
         path="*"
         element={<NotFound />}
       />
      </Routes>
       <ToastContainer
         position="top-right"
         autoClose={2500}
         hideProgressBar={false}
         newestOnTop
         closeOnClick
         pauseOnHover
         theme="colored"
       />
    </BrowserRouter>
  );
}

export default App
