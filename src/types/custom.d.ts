declare module '@/hooks/useTeachers' {
  import { Teacher } from '@/types';
  export const useTeachers: () => {
    teachers: Teacher[];
    isLoading: boolean;
    addTeacher: (teacher: Teacher) => Promise<boolean>;
  };
}

declare module '@/hooks/useStudents' {
  import { Student } from '@/types';
  export const useStudents: () => {
    students: Student[];
    isLoading: boolean;
    addStudent: (student: Student) => Promise<boolean>;
  };
}

declare module '@/hooks/useSchools' {
  import { School } from '@/types';
  export const useSchools: () => {
    schools: School[];
    isLoading: boolean;
  };
}

declare module '@/hooks/useUserSearch' {
  import { Teacher, Student } from '@/types';
  export const useUserSearch: (
    searchTerm: string,
    teachers: Teacher[],
    students: Student[]
  ) => {
    filteredTeachers: Teacher[];
    filteredStudents: Student[];
  };
}

declare module '@/components/users/UserManagementHeader' {
  import { FC } from 'react';
  import { Teacher, Student, School } from '@/types';
  
  interface UserManagementHeaderProps {
    activeTab: string;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: (isOpen: boolean) => void;
    newTeacher: Teacher;
    setNewTeacher: (teacher: Teacher) => void;
    newStudent: Student;
    setNewStudent: (student: Student) => void;
    handleAddTeacher: () => void;
    handleAddStudent: () => void;
    schools: School[];
    subjects: string[];
    grades: string[];
  }

  const UserManagementHeader: FC<UserManagementHeaderProps>;
  export default UserManagementHeader;
}

declare module '@/components/users/UserTabs' {
  import { FC } from 'react';
  import { Teacher, Student } from '@/types';
  
  interface UserTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    filteredTeachers: Teacher[];
    filteredStudents: Student[];
    isLoading: boolean;
  }

  const UserTabs: FC<UserTabsProps>;
  export default UserTabs;
} 