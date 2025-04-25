
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Users, User, BookOpen } from 'lucide-react';

interface StatsProps {
  totalTenants: number;
  totalSchools: number;
  totalUsers: number;
  totalStudents: number;
}

const SuperadminDashboard = ({ totalTenants, totalSchools, totalUsers, totalStudents }: StatsProps) => (
  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalTenants}</div>
        <p className="text-xs text-muted-foreground">
          {totalTenants > 0 ? 'Active tenants' : 'No tenants yet'}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
        <School className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalSchools}</div>
        <p className="text-xs text-muted-foreground">
          {totalSchools > 0 ? 'Active schools' : 'No schools yet'}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
        <User className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalUsers}</div>
        <p className="text-xs text-muted-foreground">
          {totalUsers > 0 ? 'Total system users' : 'No users yet'}
        </p>
      </CardContent>
    </Card>

    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>System Overview</CardTitle>
        <CardDescription>
          Current status and statistics for the entire system
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Tenants</p>
            <p className="text-2xl font-bold">{totalTenants}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-secondary/10 rounded-full">
            <School className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium">Schools</p>
            <p className="text-2xl font-bold">{totalSchools}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Total Users</p>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-secondary/10 rounded-full">
            <BookOpen className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium">Students</p>
            <p className="text-2xl font-bold">{totalStudents}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default SuperadminDashboard;
