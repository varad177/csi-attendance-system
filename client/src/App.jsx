import "./App.css";
import { useState } from "react";
import AdminHome from "./Pages/AdminHome";
import AdminLogin from "./Pages/AdminLogin";
import AllStudent from "./Pages/AllStudent";
import PersonalDetailsForm from "./Pages/PersonalDetailsForm";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import OtpForm from "./Pages/OtpForm"; // Adjust the path as needed
import Success from "./Pages/Success"; // Adjust the path as needed


function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    department: "",
    year: "",
    semester: "",
    rollNo: "",
    division: "",
    otp: "",
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PersonalDetailsForm formData={formData} setFormData={setFormData} />} />
        <Route path="/otp" element={<OtpForm formData={formData} setFormData={setFormData} />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/csi-admin-home" element={<AdminHome />} />
        <Route path="/admin/all-students" element={<AllStudent />} />
      </Routes>
    </Router>
  );
}

export default App;