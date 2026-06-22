import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Editor from "./components/Editor";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element = {<Signup/>}/>
       <Route path="/login" element = {<Login/>}/>
      <Route path="/editor" element={<Editor />} />
    </Routes>
  );
}

export default App;