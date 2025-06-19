import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { ProjectsPage } from "./pages/ProjectsPage";
import { StoriesPage } from "./pages/StoriesPage";
import { TasksPage } from "./pages/TasksPage";
import { LoginPage } from "./pages/LoginPage";
import { PrivateRoute } from "./components/PrivateRoute";
import ApiService from "./services/api.service";
import './App.css';

function App() {
  const isAuthenticated = ApiService.isAuthenticated();

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
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
        )}

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <PrivateRoute>
              <ProjectsPage />
            </PrivateRoute>
          } />
          <Route path="/stories" element={
            <PrivateRoute>
              <StoriesPage />
            </PrivateRoute>
          } />
          <Route path="/tasks" element={
            <PrivateRoute>
              <TasksPage />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
