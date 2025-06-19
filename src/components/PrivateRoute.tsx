import { Navigate } from 'react-router-dom';
import ApiService from '../services/api.service';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isAuthenticated = ApiService.isAuthenticated();
    
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};