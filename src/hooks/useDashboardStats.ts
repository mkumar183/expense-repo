
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface DashboardStats {
  totalTenants: number;
  totalSchools: number;
  totalUsers: number;
  totalStudents: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTenants: 0,
    totalSchools: 0,
    totalUsers: 0,
    totalStudents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total tenants
        const { count: tenantsCount, error: tenantsError } = await supabase
          .from('tenants')
          .select('*', { count: 'exact', head: true });

        if (tenantsError) throw tenantsError;

        // Fetch total schools
        const { count: schoolsCount, error: schoolsError } = await supabase
          .from('schools')
          .select('*', { count: 'exact', head: true });

        if (schoolsError) throw schoolsError;

        // Fetch total users
        const { count: usersCount, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Fetch total students
        const { count: studentsCount, error: studentsError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'student');

        if (studentsError) throw studentsError;

        setStats({
          totalTenants: tenantsCount || 0,
          totalSchools: schoolsCount || 0,
          totalUsers: usersCount || 0,
          totalStudents: studentsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to fetch dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
};
