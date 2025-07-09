import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import { FlashcardProvider } from './context/FlashcardContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { TodoProvider } from './context/TodoContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/admin/AdminRoute';
import FeatureRoute from './components/auth/FeatureRoute';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import Landing from './pages/Landing';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import TodoBoard from './pages/TodoBoard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PlanManagement from './pages/admin/PlanManagement';
import CouponManagement from './pages/admin/CouponManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import FlashcardManagement from './pages/admin/FlashcardManagement';
import Flashcards from './pages/Flashcards';
import FlashcardCategory from './pages/FlashcardCategory';
import FlashcardSingle from './pages/FlashcardSingle';
import './App.css';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <AdminLayout>
            <UserManagement />
          </AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/plans" element={
        <AdminRoute>
          <AdminLayout>
            <PlanManagement />
          </AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/coupons" element={
        <AdminRoute>
          <AdminLayout>
            <CouponManagement />
          </AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/categories" element={
        <AdminRoute>
          <AdminLayout>
            <CategoryManagement />
          </AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/flashcards" element={
        <AdminRoute>
          <AdminLayout>
            <FlashcardManagement />
          </AdminLayout>
        </AdminRoute>
      } />
      <Route path="/admin/settings" element={
        <AdminRoute>
          <AdminLayout>
            <Settings />
          </AdminLayout>
        </AdminRoute>
      } />
      
      {/* Protected user routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/todo" element={
        <ProtectedRoute>
          <FeatureRoute feature="todoboardEnabled">
            <Layout>
              <TodoBoard />
            </Layout>
          </FeatureRoute>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/flashcards" element={
        <ProtectedRoute>
          <FlashcardProvider>
            <Flashcards />
          </FlashcardProvider>
        </ProtectedRoute>
      } />
      <Route path="/flashcards/:categoryId" element={
        <ProtectedRoute>
          <FlashcardProvider>
            <FlashcardCategory />
          </FlashcardProvider>
        </ProtectedRoute>
      } />
      <Route path="/flashcards/:categoryId/:flashcardId" element={
        <ProtectedRoute>
          <FlashcardProvider>
            <FlashcardSingle />
          </FlashcardProvider>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <FlashcardProvider>
            <SubscriptionProvider>
              <TodoProvider>
                <Router>
                  <Toaster position="top-right" />
                  <AppRoutes />
                </Router>
              </TodoProvider>
            </SubscriptionProvider>
          </FlashcardProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;