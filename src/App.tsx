import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import Admission from "./pages/Admission";
import ExamResults from "./pages/ExamResults";
import Gallery from "./pages/Gallery";
import Notices from "./pages/Notices";
import Contact from "./pages/Contact";
import Branches from "./pages/Branches";

// Lazy load less critical routes to improve initial load speed
const PrincipalMessage = lazy(() => import("./pages/about/PrincipalMessage"));
const GoverningBody = lazy(() => import("./pages/about/GoverningBody"));
const Teachers = lazy(() => import("./pages/about/Teachers"));
const Staff = lazy(() => import("./pages/about/Staff"));
const AcademicCalendar = lazy(() => import("./pages/academic/AcademicCalendar"));
const ClassRoutine = lazy(() => import("./pages/academic/ClassRoutine"));
const ExamRoutine = lazy(() => import("./pages/exam/ExamRoutine"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminRegistration = lazy(() => import("./pages/admin/AdminRegistration"));
const PasswordReset = lazy(() => import("./pages/admin/PasswordReset"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminNotices = lazy(() => import("./pages/admin/AdminNotices"));
const AdminResults = lazy(() => import("./pages/admin/AdminResults"));
const AdminAdmissions = lazy(() => import("./pages/admin/AdminAdmissions"));
const AdminBranches = lazy(() => import("./pages/admin/AdminBranches"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const PendingAdminApprovals = lazy(() => import("./pages/admin/PendingAdminApprovals"));
const AdminUserList = lazy(() => import("./pages/admin/AdminUserList"));
const AdminExamRoutine = lazy(() => import("./pages/admin/AdminExamRoutine"));
const AdminClassRoutine = lazy(() => import("./pages/admin/AdminClassRoutine"));
const AdminAcademicCalendar = lazy(() => import("./pages/admin/AdminAcademicCalendar"));
const AdminTeachers = lazy(() => import("./pages/admin/AdminTeachers"));
const AdminVideos = lazy(() => import("./pages/admin/AdminVideos"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admission" element={<Admission />} />
                <Route path="/exam/results" element={<ExamResults />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/notices" element={<Notices />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/about/principal-message" element={<PrincipalMessage />} />
                <Route path="/about/governing-body" element={<GoverningBody />} />
                <Route path="/about/teachers" element={<Teachers />} />
                <Route path="/about/staff" element={<Staff />} />
                <Route path="/academic/calendar" element={<AcademicCalendar />} />
                <Route path="/academic/routine" element={<ClassRoutine />} />
                <Route path="/exam/routine" element={<ExamRoutine />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegistration />} />
                <Route path="/admin/password-reset" element={<PasswordReset />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUserList />} />
                <Route path="/admin/routine" element={<AdminExamRoutine />} />
                <Route path="/admin/class-routine" element={<AdminClassRoutine />} />
                <Route path="/admin/calendar" element={<AdminAcademicCalendar />} />
                <Route path="/admin/approvals" element={<PendingAdminApprovals />} />
                <Route path="/admin/notices" element={<AdminNotices />} />
                <Route path="/admin/results" element={<AdminResults />} />
                <Route path="/admin/admissions" element={<AdminAdmissions />} />
                <Route path="/admin/branches" element={<AdminBranches />} />
                <Route path="/admin/gallery" element={<AdminGallery />} />
                <Route path="/admin/videos" element={<AdminVideos />} />
                <Route path="/admin/teachers" element={<AdminTeachers />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
