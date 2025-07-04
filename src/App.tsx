import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { ProjectsPage } from "./pages/ProjectsPage";
import { StoriesPage } from "./pages/StoriesPage";
import { TasksPage } from "./pages/TasksPage";
import { LoginPage } from "./pages/LoginPage";
import { PrivateRoute } from "./components/PrivateRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import ApiService from "./services/api.service";

function App() {
  const isAuthenticated = ApiService.isAuthenticated();

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {isAuthenticated && (
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  {/* Logo i nawigacja */}
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                      </div>
                      <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">ManagMe</h1>
                    </div>
                    
                    {/* Nawigacja desktop */}
                    <nav className="hidden md:flex space-x-6">
                      <NavLink 
                        to="/" 
                        className={({ isActive }) => 
                          isActive 
                            ? 'flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }
                      >
                        Projekty
                      </NavLink>
                      <NavLink 
                        to="/stories" 
                        className={({ isActive }) => 
                          isActive 
                            ? 'flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }
                      >
                        Historyjki
                      </NavLink>
                      <NavLink 
                        to="/tasks" 
                        className={({ isActive }) => 
                          isActive 
                            ? 'flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }
                      >
                        Zadania
                      </NavLink>
                    </nav>
                  </div>

                  {/* Prawa strona nagłówka */}
                  <div className="flex items-center space-x-4">
                    <ThemeToggle />
                  </div>
                </div>

                {/* Nawigacja mobilna */}
                <nav className="md:hidden px-4 pb-4">
                  <div className="flex space-x-2">
                    <NavLink 
                      to="/" 
                      className={({ isActive }) => 
                        isActive 
                          ? 'flex items-center px-3 py-2 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'flex items-center px-3 py-2 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }
                    >
                      Projekty
                    </NavLink>
                    <NavLink 
                      to="/stories" 
                      className={({ isActive }) => 
                        isActive 
                          ? 'flex items-center px-3 py-2 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'flex items-center px-3 py-2 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }
                    >
                      Historyjki
                    </NavLink>
                    <NavLink 
                      to="/tasks" 
                      className={({ isActive }) => 
                        isActive 
                          ? 'flex items-center px-3 py-2 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'flex items-center px-3 py-2 text-xs font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
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
    </ThemeProvider>
  );
}

export default App;