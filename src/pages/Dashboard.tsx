
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, isLoading } = useDashboardStats();

  if (isLoading && user?.role === 'superadmin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {user?.role === 'superadmin' && <SuperadminDashboard {...stats} />}
      {user?.role === 'tenant_admin' && <AdminDashboard />}
      {user?.role === 'school_admin' && <AdminDashboard />}
      {user?.role === 'teacher' && <TeacherDashboard />}
      {user?.role === 'student' && <StudentDashboard />}
    </div>
  );
};

export default Dashboard;
