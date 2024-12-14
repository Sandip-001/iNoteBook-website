import './App.css';
import About from './Components/About';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Alert from './Components/Alert';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NoteState from './context/notes/NoteState';
import { useState, useContext } from 'react';
import Login from './Components/Login';
import noteContext from './context/notes/noteContext';
import Signup from './Components/Signup';

const PrivateRoute = ({ children }) => {
  const context = useContext(noteContext);
  const { authToken } = context;
  const isAuthenticated = authToken || localStorage.getItem("token");

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  return (
    <NoteState>
      <Router>
        <Navbar />
        <Alert message={alert.message} type={alert.type} />
        <div className='container'>
          <Routes>
            <Route exact path="/" element={<PrivateRoute><Home showAlert={showAlert} /></PrivateRoute>} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/login" element={<Login showAlert={showAlert}/>} />
            <Route exact path="/signup" element={<Signup showAlert={showAlert}/>} />
          </Routes>
        </div>
      </Router>
    </NoteState>
  );
}

export default App;
