import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound"; // Keep NotFound imported directly

// Import the new LoadingSpinner
import LoadingSpinner from './components/LoadingSpinner';

// --- Lazy load page components ---
const Index = lazy(() => import('./pages/Index'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
// Lazy load components *inside* AdminLayout if needed for further optimization
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AddProjectPage = lazy(() => import("./pages/AddProjectPage"));
const UserManagementPage = lazy(() => import("./pages/UserManagementPage"));
const EditProjectPage = lazy(() => import('./pages/EditProjectPage'));
const AdminMessagesPage = lazy(() => import('./pages/AdminMessagesPage'));
// --- ---

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          {/* --- Use LoadingSpinner as Suspense fallback --- */}
          <Suspense fallback={<LoadingSpinner />}>
            <ScrollToTop />
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:projectSlug" element={<CaseStudyPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/account" element={<AccountPage />} />

              {/* Admin Routes */}
              <Route element={<AdminLayout />}>
                {/* Wrap inner admin routes in Suspense if lazy loaded */}
                 <Route path="/admin" element={<AdminPage />} />
                 <Route path="/admin/projects/new" element={<AddProjectPage />} />
                 <Route path="/admin/users" element={<UserManagementPage />} />
                 <Route path="/admin/projects/edit/:projectId" element={<EditProjectPage />} />
                 <Route path="/admin/messages" element={<AdminMessagesPage />} />
              </Route>

              {/* Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          {/* --- End Suspense --- */}
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;