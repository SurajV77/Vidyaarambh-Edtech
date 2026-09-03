import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

// Layouts & Route Guards
import AdminLayout from './components/layout/AdminLayout';
import StudentLayout from './components/layout/StudentLayout';
import AdminRoute from './components/layout/AdminRoute';
import StudentRoute from './components/layout/StudentRoute';

// Public Pages
import Landing from './pages/Landing';
import AdminLogin from './pages/admin/AdminLogin';
import StudentLogin from './pages/student/StudentLogin';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsManagement from './pages/admin/StudentsManagement';
import FeesManagement from './pages/admin/FeesManagement';
import MaterialsManagement from './pages/admin/MaterialsManagement';
import NoticesManagement from './pages/admin/NoticesManagement';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentMaterials from './pages/student/StudentMaterials';
import StudentFees from './pages/student/StudentFees';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          {/* Public Landing & Login Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/student/login" element={<StudentLogin />} />

          {/* Teacher/Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<StudentsManagement />} />
              <Route path="/admin/fees" element={<FeesManagement />} />
              <Route path="/admin/materials" element={<MaterialsManagement />} />
              <Route path="/admin/notices" element={<NoticesManagement />} />
            </Route>
          </Route>

          {/* Student Protected Routes */}
          <Route element={<StudentRoute />}>
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/materials" element={<StudentMaterials />} />
              <Route path="/student/fees" element={<StudentFees />} />
            </Route>
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
