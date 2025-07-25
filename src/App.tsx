import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { ProjectsPage } from "./pages/ProjectsPage";
import { StoriesPage } from "./pages/StoriesPage";
import { TasksPage } from "./pages/TasksPage";
import { LoginPage } from "./pages/LoginPage";
import { PrivateRoute } from "./components/PrivateRoute";
import { ThemeToggle } from "./components/ThemeSwitcher";
import ApiService from "./services/api.service";
import './index.css';

function App() {
  const isAuthenticated = ApiService.isAuthenticated();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {isAuthenticated && (
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo i nawigacja */}
                <div className="flex items-center space-x-8">
                  <div className="flex-shrink-0">
                    <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      ManagMe
                    </h1>
                  </div>
                  
                  <nav className="hidden md:flex space-x-1">
                    <NavLink 
                      to="/" 
                      className={({ isActive }) => 
                        isActive ? 'nav-link-active' : 'nav-link text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                      }
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Projekty
                    </NavLink>
                    <NavLink 
                      to="/stories" 
                      className={({ isActive }) => 
                        isActive ? 'nav-link-active' : 'nav-link text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                      }
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Historyjki
                    </NavLink>
                    <NavLink 
                      to="/tasks" 
                      className={({ isActive }) => 
                        isActive ? 'nav-link-active' : 'nav-link text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                      }
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Zadania
                    </NavLink>
                  </nav>
                </div>

                {/* Przełącznik motywu */}
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                </div>
              </div>
              
              {/* Mobilna nawigacja */}
              <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1">
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                      isActive ? 'nav-link-active text-xs' : 'nav-link text-gray-600 dark:text-gray-300 text-xs'
                    }
                  >
                    Projekty
                  </NavLink>
                  <NavLink 
                    to="/stories" 
                    className={({ isActive }) => 
                      isActive ? 'nav-link-active text-xs' : 'nav-link text-gray-600 dark:text-gray-300 text-xs'
                    }
                  >
                    Historyjki
                  </NavLink>
                  <NavLink 
                    to="/tasks" 
                    className={({ isActive }) => 
                      isActive ? 'nav-link-active text-xs' : 'nav-link text-gray-600 dark:text-gray-300 text-xs'
                    }
                  >
                    Zadania
                  </NavLink>
                </div>
              </nav>
            </div>
          </header>
        )}

        <main className={isAuthenticated ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
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
        </main>
      </div>
    </Router>
  );
}

export default App;