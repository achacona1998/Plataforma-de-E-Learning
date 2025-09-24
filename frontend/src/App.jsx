import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import CourseList from "./pages/courses/CourseList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStatistics from "./pages/admin/AdminStatistics";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminCertificates from "./pages/admin/AdminCertificates";
import CourseCreate from "./pages/admin/CourseCreate";
import CourseEdit from "./pages/admin/CourseEdit";
import UserCreate from "./pages/admin/UserCreate";
import UserEdit from "./pages/admin/UserEdit";
import UserView from "./pages/admin/UserView";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAnalytics from "./pages/student/StudentAnalytics";
import StudentCertificates from "./pages/student/StudentCertificates";
import MyStudents from "./pages/instructor/MyStudents";
import InstructorAnalytics from "./pages/instructor/InstructorAnalytics";
import InstructorCertificates from "./pages/instructor/InstructorCertificates";
import QuizManager from "./pages/instructor/QuizManager";

// Lazy load components for better performance
import { lazy, Suspense } from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CourseDetail from "./pages/courses/CourseDetail";
import Dashboard from "./components/dashboard/Dashboard";
import MyLearning from "./pages/learning/MyLearning";
import Progress from "./components/ui/Progress";

import Checkout from "./components/payment/Checkout";
import PaymentSuccess from "./components/payment/PaymentSuccess";
import PaymentCancel from "./components/payment/PaymentCancel";
import PaymentHistory from "./components/payment/PaymentHistory";
import CertificateGenerator from "./components/certificates/CertificateGenerator";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import QuizTaker from "./components/quiz/QuizTaker";
import CertificateVerification from "./pages/learning/CertificateVerification";
import StudentLayout from "./layout/StudentLayout";
const CreateCourse = lazy(() => import("./pages/instructor/CreateCourse"));

// Component to handle initial route based on authentication
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-32 h-32 rounded-full border-b-2 border-teal-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : (
            <Navigate
              to={
                user.rol === "admin" ? "/admin/dashboard" : "/student/dashboard"
              }
              replace
            />
          )
        }
      />
      <Route
        path="/register"
        element={
          !user ? (
            <Register />
          ) : (
            <Navigate
              to={
                user.rol === "admin" ? "/admin/dashboard" : "/student/dashboard"
              }
              replace
            />
          )
        }
      />

      {/* Root route - redirect to login if not authenticated, otherwise to appropriate dashboard */}
      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : (
            <Navigate
              to={
                user.rol === "admin" ? "/admin/dashboard" : "/student/dashboard"
              }
              replace
            />
          )
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="courses/create" element={<CourseCreate />} />
              <Route path="courses/edit/:id" element={<CourseEdit />} />
              <Route path="students" element={<AdminUsers />} />
              <Route path="students/create" element={<UserCreate />} />
              <Route path="students/edit/:id" element={<UserEdit />} />
              <Route path="students/view/:id" element={<UserView />} />
              <Route path="statistics" element={<AdminStatistics />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Instructor routes */}
      <Route
        path="/instructor/*"
        element={
          <ProtectedRoute requiredRole="instructor">
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="create-course" element={<CreateCourse />} />
              <Route path="my-students" element={<MyStudents />} />
              <Route path="analytics" element={<InstructorAnalytics />} />
              <Route path="certificates" element={<InstructorCertificates />} />
              <Route path="quiz-manager" element={<QuizManager />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Student routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentLayout>
              <Routes>
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="analytics" element={<StudentAnalytics />} />
                <Route path="certificates" element={<StudentCertificates />} />
                <Route path="courses" element={<CourseList />} />
                <Route path="courses/:id" element={<CourseDetail />} />
                <Route path="create-course" element={<CreateCourse />} />
                <Route path="my-learning" element={<MyLearning />} />
                <Route path="progress" element={<Progress />} />
                <Route path="checkout/:courseId" element={<Checkout />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="payment-cancel" element={<PaymentCancel />} />
                <Route path="payment-history" element={<PaymentHistory />} />
                <Route path="certificate-generator" element={<CertificateGenerator />} />
                <Route path="verify-certificate" element={<CertificateVerification />} />
                <Route path="quiz/:quizId" element={<QuizTaker />} />
                <Route path="course/:cursoId/quizzes" element={<QuizManager />} />
              </Routes>
            </StudentLayout>
          </ProtectedRoute>
        }
      />


    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              <div className="w-32 h-32 rounded-full border-b-2 border-teal-600 animate-spin"></div>
            </div>
          }>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
