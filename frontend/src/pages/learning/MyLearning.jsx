import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const MyLearning = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/inscripciones/usuario",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch enrolled courses");
      const data = await response.json();
      setEnrolledCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = enrolledCourses.filter((course) => {
    switch (filter) {
      case "inProgress":
        return course.progreso > 0 && course.progreso < 100;
      case "completed":
        return course.progreso === 100;
      case "notStarted":
        return course.progreso === 0;
      default:
        return true;
    }
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  if (error)
    return <div className="h-64 text-center text-red-600">{error}</div>;

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
        <p className="mt-2 text-gray-600">
          Track and manage your enrolled courses
        </p>
      </div>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="block py-2 pr-10 pl-3 mt-1 w-48 text-base rounded-md border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="all">All Courses</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="notStarted">Not Started</option>
        </select>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-lg shadow">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No courses found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === "all"
              ? "You haven't enrolled in any courses yet."
              : `You don't have any ${filter.toLowerCase()} courses.`}
          </p>
          <div className="mt-6">
            <Link
              to="/courses"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Browse Courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="overflow-hidden bg-white rounded-lg shadow">
              <div className="relative pb-48">
                <img
                  src={course.imagen || "/placeholder-course.svg"}
                  alt={course.titulo}
                  className="object-cover absolute w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  {course.titulo}
                </h3>
                <p className="mb-4 text-sm text-gray-500">
                  {course.descripcion}
                </p>

                <div className="mb-4">
                  <div className="flex justify-between mb-1 text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{course.progreso}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${course.progreso}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <span className="text-sm text-gray-500">
                    {course.modulos?.length || 0} modules
                  </span>
                  <Link
                    to={`/courses/${course._id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent hover:bg-indigo-700">
                    {course.progreso === 0 ? "Start Learning" : "Continue"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLearning;
