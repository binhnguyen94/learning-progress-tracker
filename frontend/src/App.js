import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Categories from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import StudyLogs from "./pages/StudyLogs";
import Topics from "./pages/Topics";
import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/logs" element={<StudyLogs />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
