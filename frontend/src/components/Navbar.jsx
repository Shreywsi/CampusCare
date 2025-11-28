import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <div className="font-bold text-xl">CampusCare</div>
      <div className="space-x-4">
        <Link to="/register" className="hover:underline">Register</Link>
        <Link to="/doctor-login" className="hover:underline">Doctor Login</Link>
        <Link to="/book-appointment" className="hover:underline">Book Appointment</Link>
        <Link to="/records" className="hover:underline">Medical Records</Link>
        <Link to="/admin" className="hover:underline">Admin</Link>
      </div>
    </nav>
  );
}