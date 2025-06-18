import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ProjectsPage } from "./pages/ProjectsPage";
import { StoriesPage } from "./pages/StoriesPage";
import { TasksPage } from "./pages/TasksPage";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="app-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            Projekty
          </NavLink>
          <NavLink to="/stories" className={({ isActive }) => isActive ? 'active' : ''}>
            Historyjki
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>
            Zadania
          </NavLink>
        </nav>
        
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;