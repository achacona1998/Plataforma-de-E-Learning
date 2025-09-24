import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const userRole = user?.rol || "student";

  const studentItems = [
    { name: "Dashboard", path: "/student/dashboard", icon: "📊" },
    { name: "Mis Cursos", path: "/student/courses", icon: "📚" },
    { name: "Mi Aprendizaje", path: "/student/my-learning", icon: "📖" },
    { name: "Progreso", path: "/student/progress", icon: "📈" },
    { name: "Estadísticas", path: "/student/analytics", icon: "📊" },
    { name: "Certificados", path: "/student/certificates", icon: "🎓" },
  ];

  const generalItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "My Courses", path: "/my-courses", icon: "📚" },
    { name: "Progress", path: "/progress", icon: "📈" },
    { name: "Certificates", path: "/certificates", icon: "🎓" },
  ];

  const instructorItems = [
    { name: "Dashboard", path: "/instructor/dashboard", icon: "🏠" },
    { name: "Create Course", path: "/instructor/create-course", icon: "✏️" },
    { name: "My Students", path: "/instructor/my-students", icon: "👥" },
    { name: "Analytics", path: "/instructor/analytics", icon: "📊" },
  ];

  const adminItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "🏠" },
    { name: "User Management", path: "/admin/students", icon: "👤" },
    { name: "Course Management", path: "/admin/courses", icon: "📚" },
    { name: "Statistics", path: "/admin/statistics", icon: "📊" },
    { name: "Payments", path: "/admin/payments", icon: "💳" },
    { name: "Reports", path: "/admin/reports", icon: "📝" },
    { name: "Settings", path: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-1 h-0 bg-indigo-600 border-r border-indigo-200">
          <div className="flex overflow-y-auto flex-col flex-1 pt-5 pb-4">
            <nav className="flex-1 px-2 mt-5 space-y-2">
              {isAuthenticated && (
                <>
                  {userRole === "student" ? (
                    <>
                      <div className="mb-4">
                        <div className="flex relative justify-center mb-2">
                          <span className="px-2 text-sm text-sky-200 bg-indigo-600">
                            Estudiante
                          </span>
                        </div>
                      </div>
                      {studentItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="flex items-center px-3 py-2 text-sm font-medium text-white rounded-md transition-all duration-200 group hover:bg-indigo-500">
                          <span className="mr-3 text-sky-200">{item.icon}</span>
                          {item.name}
                        </Link>
                      ))}
                    </>
                  ) : (
                    generalItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="flex items-center px-3 py-2 text-sm font-medium text-white rounded-md transition-all duration-200 group hover:bg-indigo-500">
                        <span className="mr-3 text-sky-200">{item.icon}</span>
                        {item.name}
                      </Link>
                    ))
                  )}

                  {userRole === "instructor" && (
                    <>
                      <div className="relative py-4">
                        <div
                          className="flex absolute inset-0 items-center"
                          aria-hidden="true">
                          <div className="w-full border-t border-indigo-400" />
                        </div>
                        <div className="flex relative justify-center">
                          <span className="px-2 text-sm text-sky-200 bg-indigo-600">
                            Instructor
                          </span>
                        </div>
                      </div>

                      {instructorItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="flex items-center px-3 py-2 text-sm font-medium text-white rounded-md transition-all duration-200 group hover:bg-indigo-500">
                          <span className="mr-3 text-sky-200">{item.icon}</span>
                          {item.name}
                        </Link>
                      ))}
                    </>
                  )}

                  {userRole === "admin" && (
                    <>
                      <div className="relative py-4">
                        <div
                          className="flex absolute inset-0 items-center"
                          aria-hidden="true">
                          <div className="w-full border-t border-indigo-400" />
                        </div>
                        <div className="flex relative justify-center">
                          <span className="px-2 text-sm text-sky-200 bg-indigo-600">
                            Administrator
                          </span>
                        </div>
                      </div>

                      {adminItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="flex items-center px-3 py-2 text-sm font-medium text-white rounded-md transition-all duration-200 group hover:bg-indigo-500">
                          <span className="mr-3 text-sky-200">{item.icon}</span>
                          {item.name}
                        </Link>
                      ))}
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
