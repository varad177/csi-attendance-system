import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../axiosInstance";
import CSILogo from "../assets/images/CSI_LOGO.png"; // Adjust the path as needed
import Loader from "../Components/Loader";

const OtpForm = ({ formData, setFormData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loader, SetLoder] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {

    SetLoder(true)
    setTimeout(() => {
      SetLoder(false)
    }, 1500)

  }, [])


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirm();
  };

  // let re = /^\d{4}[A-Z]{4}[A-Z]{4}\d{3}$/;


  // if (!re.test(formData.studentId)) {
  //   toast.error("Invalid Student ID");

  //   return;

  // }

  const handleConfirm = async () => {
    setIsModalVisible(true);
    try {

      SetLoder(true);
      const response = await axiosInstance.post(
        "/student/add-attendance",
        {
          firstname: formData.firstName,
          lastname: formData.lastName,
          department: formData.department,
          studentid: formData.studentId.toUpperCase(),
          year: formData.year,
          sem: formData.semester,
          div: formData.division,
          roll: formData.rollNo,
          otp: formData.otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      SetLoder(false)

      setFormData({
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

      navigate("/success"); // Navigate to a success page or handle success logic here
    } catch (error) {
      toast.error(error.response.data.message);
      SetLoder(false)
    } finally {
      setIsModalVisible(false);
    }
  };

  return (

    <>
      {
        loader ? <Loader msg={"LOADING..."} /> :
          <div className="flex justify-center items-center min-h-screen bg-white-100 p-4">
            <div className="relative bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
              <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-4 md:mb-0">Enter OTP</h2>
                <img src={CSILogo} alt="CSI Logo" className="w-12 h-12 md:w-16 md:h-16" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="otp">
                      OTP
                    </label>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full border-gray-300 border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full h-12 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
      }</>

  );
};

export default OtpForm;
