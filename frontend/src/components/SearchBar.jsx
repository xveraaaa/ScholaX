import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUserGraduate, FaChalkboardUser, FaBookOpen } from "react-icons/fa";
import api from "../services/api";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ students: [], teachers: [], courses: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults({ students: [], teachers: [], courses: [] });
        return;
      }
      
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${query}`);
        setResults(res.data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const getIcon = (type) => {
    switch(type) {
      case 'student': return <FaUserGraduate className="text-blue-500" />;
      case 'teacher': return <FaChalkboardUser className="text-green-500" />;
      case 'course': return <FaBookOpen className="text-purple-500" />;
      default: return <FaSearch />;
    }
  };

  const handleSelect = (item, type) => {
    setQuery("");
    setShowDropdown(false);
    if (type === 'student') navigate(`/admin/students/${item.id}`);
    if (type === 'teacher') navigate(`/admin/teachers/${item.id}`);
    if (type === 'course') navigate(`/admin/courses/${item.id}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search students, teachers, courses..."
          className="w-96 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showDropdown && (results.students.length > 0 || results.teachers.length > 0 || results.courses.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.students.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-1">STUDENTS</div>
              {results.students.map((student) => (
                <div
                  key={student.id}
                  onClick={() => handleSelect(student, 'student')}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  {getIcon('student')}
                  <div>
                    <div className="font-medium">{student.first_name} {student.last_name}</div>
                    <div className="text-xs text-gray-500">{student.student_id} • {student.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.teachers.length > 0 && (
            <div className="p-2 border-t">
              <div className="text-xs font-semibold text-gray-500 px-3 py-1">TEACHERS</div>
              {results.teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  onClick={() => handleSelect(teacher, 'teacher')}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  {getIcon('teacher')}
                  <div>
                    <div className="font-medium">{teacher.first_name} {teacher.last_name}</div>
                    <div className="text-xs text-gray-500">{teacher.teacher_code} • {teacher.specialization || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.courses.length > 0 && (
            <div className="p-2 border-t">
              <div className="text-xs font-semibold text-gray-500 px-3 py-1">COURSES</div>
              {results.courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleSelect(course, 'course')}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  {getIcon('course')}
                  <div>
                    <div className="font-medium">{course.course_code}</div>
                    <div className="text-xs text-gray-500">{course.course_name} • {course.credits} credits</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}