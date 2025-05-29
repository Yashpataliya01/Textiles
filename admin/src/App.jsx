import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/home/home";
import Navbar from "./components/navbar/navbar";
import Main from "./components/main/main";
import SubMain from "./components/submain/submain";
import Submainimage from "./components/submain/submainimage";
import Login from "./components/Login.jsx";
import Blogs from "./components/Blogs/Blogs.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/"
            element={localStorage.getItem("isLogin") ? <Home /> : <Login />}
          />
          <Route path="/main/:id" element={<Main />} />
          <Route path="/main/:id/:id" element={<SubMain />} />
          <Route path="/main/:id/:id/:id" element={<Submainimage />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
