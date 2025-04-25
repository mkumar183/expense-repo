
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CalendarRange, ChevronUp } from 'lucide-react';

const StudentDashboard = () => (
  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">My Classes</CardTitle>
        <BookOpen className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">6</div>
        <p className="text-xs text-muted-foreground">
          Next: Science at 11:30 AM
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Assignments</CardTitle>
        <CalendarRange className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">3</div>
        <p className="text-xs text-muted-foreground">
          Due this week
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">A-</div>
        <p className="text-xs text-muted-foreground">
          +5% from last semester
        </p>
      </CardContent>
    </Card>
    
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
        <CardDescription>
          Your classes for today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">English Literature</p>
              <p className="text-xs text-muted-foreground">Ms. Johnson - Room 102</p>
            </div>
            <div className="text-sm">8:30 AM</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-secondary/10 rounded-full">
              <BookOpen className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Science</p>
              <p className="text-xs text-muted-foreground">Mr. Roberts - Room 203</p>
            </div>
            <div className="text-sm">11:30 AM</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Mathematics</p>
              <p className="text-xs text-muted-foreground">Mrs. Davis - Room 101</p>
            </div>
            <div className="text-sm">2:00 PM</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default StudentDashboard;
