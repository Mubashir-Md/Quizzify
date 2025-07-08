import { Link, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (!isAdminRoute) return null; // Don't show on non-admin routes

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-around items-center shadow-md sticky top-0 inset-0">
      <h1 className="text-xl font-bold">Quizzify</h1>
      <ul className="flex space-x-6 text-sm">
        <li>
          <Link to="/admin/createQuiz" className="hover:text-gray-300">
            Create Quiz
          </Link>
        </li>
        <li>
          <Link to="/admin/profile" className="hover:text-gray-300">
            My Profile
          </Link>
        </li>
        <li>
          <Link to="/admin/logout" className="hover:text-gray-300">
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
