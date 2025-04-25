import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'superadmin' | 'tenant_admin' | 'school_admin' | 'teacher' | 'staff' | 'student' | 'parent';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [shouldRender, setShouldRender] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute: User state:', user);
    console.log('ProtectedRoute: Loading state:', isLoading);
    
    if (!isLoading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        navigate('/login');
      } else if (!user.role) {
        console.log('User has no role, redirecting to settings');
        navigate('/settings');
      } else if (requiredRole && user.role !== requiredRole) {
        // Special handling for Teacher Assistant
        const isTeacherAssistantRoute = window.location.pathname === '/teacher-assistant';
        const isAllowedForTeacherAssistant = 
          isTeacherAssistantRoute && 
          (user.role === 'teacher' || user.role === 'school_admin');
        
        if (isAllowedForTeacherAssistant) {
          setShouldRender(true);
        } else if (requiredRole !== user.role) {
          console.log('User does not have required role, redirecting to dashboard');
          navigate('/dashboard');
        }
      } else {
        setShouldRender(true);
      }
      setCheckComplete(true);
    }
  }, [user, isLoading, navigate, requiredRole]);

  // Only show loading indicator when actively checking the auth state
  if (isLoading && !checkComplete) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (shouldRender) {
    return <>{children}</>;
  }

  // Only show redirect message when check is complete but rendering isn't allowed
  if (checkComplete && !shouldRender) {
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }
  
  // Return empty during transitional states to prevent flicker
  return null;
};

export default ProtectedRoute;
