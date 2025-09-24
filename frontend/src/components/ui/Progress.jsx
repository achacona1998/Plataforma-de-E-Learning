import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Progress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState({
    overallProgress: 0,
    totalCoursesEnrolled: 0,
    coursesCompleted: 0,
    totalLearningTime: 0,
    achievements: [],
    recentActivities: []
  });

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const fetchProgressData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usuarios/progreso', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch progress data');
      const data = await response.json();
      setProgressData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-600 text-center h-64">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
        <p className="mt-2 text-gray-600">Track your achievements and learning journey</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Progress</h2>
        <div className="flex items-center mb-4">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="3"
                strokeDasharray={`${progressData.overallProgress}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600">{progressData.overallProgress}%</span>
            </div>
          </div>
          <div className="ml-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Courses Enrolled</p>
                <p className="text-xl font-semibold text-gray-900">{progressData.totalCoursesEnrolled}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Courses Completed</p>
                <p className="text-xl font-semibold text-gray-900">{progressData.coursesCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Learning Time</p>
                <p className="text-xl font-semibold text-gray-900">{progressData.totalLearningTime}h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
        {progressData.achievements.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No achievements yet. Keep learning to earn badges!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {progressData.achievements.map((achievement, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="w-16 h-16 mx-auto mb-2 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{achievement.icon}</span>
                </div>
                <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
        {progressData.recentActivities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activities</p>
        ) : (
          <div className="space-y-4">
            {progressData.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start border-b pb-4 last:border-0">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600">{activity.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
