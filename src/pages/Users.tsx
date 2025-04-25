import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Teacher, Student, School, Grade } from '@/types';

// Import components
import SearchBar from '@/components/users/SearchBar';
import AddUserDialog from '@/components/users/AddUserDialog';
import TeachersList from '@/components/users/TeachersList';
import StudentsList from '@/components/users/StudentsList';

// Import hooks
import { useUserManagement } from '@/hooks/useUserManagement';
import { useUserData } from '@/hooks/useUserData';
import { useUserSearch } from '@/hooks/useUserSearch';
import { useGrades } from '@/hooks/useGrades';
import { useAuth } from '@/contexts/AuthContext';

const Users = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const { user } = useAuth();
  const {
    teachers,
    setTeachers,
    students,
    setStudents,
    schools,
    setSchools,
    isLoading,
    setIsLoading,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newTeacher,
    setNewTeacher,
    newStudent,
    setNewStudent,
    handleAddTeacher,
    handleAddStudent,
  } = useUserManagement();

  // Fetch grades for the tenant
  const { grades, isLoading: gradesLoading } = useGrades(user?.tenantId || '');

  // Initialize data fetching
  useUserData(setTeachers, setStudents, setSchools, setIsLoading);

  // Handle search
  const { filteredTeachers, filteredStudents } = useUserSearch(searchTerm, teachers, students);

  const handleEditStudent = (student: Student) => {
    // TODO: Implement student editing functionality
    console.log('Editing student:', student);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <AddUserDialog
          activeTab={activeTab}
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          newTeacher={newTeacher}
          setNewTeacher={setNewTeacher}
          newStudent={newStudent}
          setNewStudent={setNewStudent}
          handleAddTeacher={handleAddTeacher}
          handleAddStudent={handleAddStudent}
          schools={schools}
          grades={grades}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
          <TabsTrigger value="teachers">Staff</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        
        {isLoading || gradesLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <TabsContent value="teachers">
              <TeachersList teachers={filteredTeachers} />
            </TabsContent>
            
            <TabsContent value="students">
              <StudentsList 
                students={filteredStudents} 
                onEdit={handleEditStudent}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Users;
