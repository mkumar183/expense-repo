
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTenantAdminStats } from '@/hooks/useTenantAdminStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Users, GraduationCap, BookOpen, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminDashboard: React.FC = () => {
  const { stats, isLoading } = useTenantAdminStats();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Data for the pie chart
  const schoolTypeData = stats.schools.reduce((acc: any[], school) => {
    const existingType = acc.find(item => item.name === (school.type || 'Unspecified'));
    if (existingType) {
      existingType.value += 1;
    } else {
      acc.push({ name: school.type || 'Unspecified', value: 1 });
    }
    return acc;
  }, []);

  // Data for the bar chart - student distribution by school
  const studentsBySchoolData = stats.schools.map(school => ({
    name: school.name,
    students: school.studentCount
  })).sort((a, b) => b.students - a.students).slice(0, 5); // Top 5 schools

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.schoolsCount}</div>
            <p className="text-xs text-muted-foreground">
              Across your tenant
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teachersCount}</div>
            <p className="text-xs text-muted-foreground">
              Managing classes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studentsCount}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled in your schools
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and tables */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Student distribution by school */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Students by School</CardTitle>
            <CardDescription>Distribution of students across top schools</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {studentsBySchoolData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studentsBySchoolData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No student data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* School types */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>School Types</CardTitle>
            <CardDescription>Distribution of schools by type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {schoolTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={schoolTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {schoolTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No school type data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Schools table */}
      <Card>
        <CardHeader>
          <CardTitle>Schools</CardTitle>
          <CardDescription>List of schools in your tenant</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.schools.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.type || 'Unspecified'}</TableCell>
                    <TableCell>{school.studentCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/schools/${school.id}`)}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No schools found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/schools/new')}
              >
                Add School
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
