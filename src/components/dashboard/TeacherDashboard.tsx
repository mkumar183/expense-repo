
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CalendarRange, LineChart } from 'lucide-react';

const TeacherDashboard = () => (
  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">My Students</CardTitle>
        <BookOpen className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">28</div>
        <p className="text-xs text-muted-foreground">In 3 classes</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
        <CalendarRange className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">2</div>
        <p className="text-xs text-muted-foreground">
          Next: Math at 10:00 AM
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">This Week</CardTitle>
        <LineChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">12 classes</div>
        <p className="text-xs text-muted-foreground">
          3 assignments due
        </p>
      </CardContent>
    </Card>
    
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Class Overview</CardTitle>
        <CardDescription>
          Your current teaching schedule
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Mathematics - Grade 9</p>
              <p className="text-xs text-muted-foreground">28 students - Room 101</p>
            </div>
            <div className="text-sm">10:00 AM</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-secondary/10 rounded-full">
              <BookOpen className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Science - Grade 8</p>
              <p className="text-xs text-muted-foreground">24 students - Room 203</p>
            </div>
            <div className="text-sm">1:30 PM</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Mathematics - Grade 10</p>
              <p className="text-xs text-muted-foreground">22 students - Room 101</p>
            </div>
            <div className="text-sm">3:00 PM</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default TeacherDashboard;
