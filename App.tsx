import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { StudentDashboard, HallHeadDashboard, SubjectTeacherDashboard, FinanceDashboard, SecurityDashboard, AdminDashboard } from './components/DashboardComponents';
import { Role } from './types';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-lg font-semibold">Loading...</div>;
  }

  if (!user) {
    return <LoginScreen />;
  }

  switch (user.role) {
    case Role.Student:
      return <StudentDashboard />;
    case Role.HallHead:
      return <HallHeadDashboard />;
    case Role.SubjectTeacher:
      return <SubjectTeacherDashboard />;
    case Role.Finance:
      return <FinanceDashboard />;
    case Role.Security:
      return <SecurityDashboard />;
    case Role.Admin:
      return <AdminDashboard />;
    default:
      // In case of an unknown role, or if logout is in progress
      return <LoginScreen />;
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
