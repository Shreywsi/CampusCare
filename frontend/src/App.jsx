import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RegisterPatient from "./pages/RegisterPatient";
import StudentLogin from "./pages/StudentLogin";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorRegister from "./pages/DoctorRegister";
import BookAppointment from "./pages/BookAppointment";
import MedicalRecords from "./pages/MedicalRecords";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPatient />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/records" element={<MedicalRecords />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;