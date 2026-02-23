// Trigger deployment - 2026-02-23T22:50
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import Admission from "./pages/Admission";
import ExamResults from "./pages/ExamResults";
import Gallery from "./pages/Gallery";
import Notices from "./pages/Notices";
import Contact from "./pages/Contact";
import Branches from "./pages/Branches";
import Administration from "./pages/about/Administration";
import PrincipalMessage from "./pages/about/PrincipalMessage";
import ChairmanMessage from "./pages/about/ChairmanMessage";
import GoverningBody from "./pages/about/GoverningBody";
import Teachers from "./pages/about/Teachers";
import Staff from "./pages/about/Staff";
import AcademicCalendar from "./pages/academic/AcademicCalendar";
import ClassRoutine from "./pages/academic/ClassRoutine";
import ExamRoutine from "./pages/exam/ExamRoutine";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegistration from "./pages/admin/AdminRegistration";
import PasswordReset from "./pages/admin/PasswordReset";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminResults from "./pages/admin/AdminResults";
import AdminAdmissions from "./pages/admin/AdminAdmissions";
import AdminBranches from "./pages/admin/AdminBranches";
import AdminGallery from "./pages/admin/AdminGallery";
import PendingAdminApprovals from "./pages/admin/PendingAdminApprovals";
import AdminUserList from "./pages/admin/AdminUserList";
import AdminExamRoutine from "./pages/admin/AdminExamRoutine";
import AdminClassRoutine from "./pages/admin/AdminClassRoutine";
import AdminTeachers from "./pages/admin/AdminTeachers";
import NotFound from "./pages/NotFound";

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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admission" element={<Admission />} />
              <Route path="/exam/results" element={<ExamResults />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/about/administration" element={<Administration />} />
              <Route path="/about/principal-message" element={<PrincipalMessage />} />
              <Route path="/about/chairman-message" element={<ChairmanMessage />} />
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
              <Route path="/admin/approvals" element={<PendingAdminApprovals />} />
              <Route path="/admin/notices" element={<AdminNotices />} />
              <Route path="/admin/results" element={<AdminResults />} />
              <Route path="/admin/admissions" element={<AdminAdmissions />} />
              <Route path="/admin/branches" element={<AdminBranches />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
              <Route path="/admin/teachers" element={<AdminTeachers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
