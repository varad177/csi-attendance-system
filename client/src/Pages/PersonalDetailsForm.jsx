import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CSILogo from "../assets/images/CSI_LOGO.png"; // Adjust the path as needed
import Loader from "../Components/Loader";
import axiosInstance from "../../axiosInstance";
import { toast } from "react-toastify";

const PersonalDetailsForm = ({ formData, setFormData }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [ename, setEname] = useState("");
  const [loc, setLoc] = useState({
    lat: null,
    lon: null
  });
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [targetLocation, setTargetLocation] = useState({ lat: null, lon: null });

  // Function to calculate distance between two coordinates
  const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lon - coords1.lon);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Function to get current location and set as target
  const setCurrentLocationAsTarget = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          // setTargetLocation(userLocation);



          // Check if the user is within the radius after setting the target location
          const distance = haversineDistance(userLocation, loc);
      
          
          if(distance> 100){
            toast.error("You are not at the event location.");
            return;
          }
       

          setIsWithinRadius(distance <= 100);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    setLoader(true);
    getloc();
    getEname();
    setTimeout(() => {
      setLoader(false);
    }, 1500);

    // Get user's current location
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            };
            // setLocation(userLocation);

            // Check if the user is within the 100-meter radius
            const distance = haversineDistance(userLocation, log);
            setIsWithinRadius(distance <= 100);
          },
          (error) => {
            console.error("Error getting location:", error);
          },
          { enableHighAccuracy: true }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, [targetLocation]);

  const getEname = async () => {
    try {
      const response = await axiosInstance.post("/get-ename");
      setEname(response.data.ename);
    } catch (error) {
      console.log(error);
    }
  };

  const getloc = async () => {
    try {
      const response = await axiosInstance.post("/get-loc");
      setLoc({
        lat: parseFloat(response.data.lat),
        lon: parseFloat(response.data.long)
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/otp");
  };

  return (
    <>
      {loader ? (
        <Loader msg={"CSI-DMCE ATTENDANCE FORM.."} />
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-white-100 p-4 pt-8 ">
          <div className="relative bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
            <div className="flex flex-col-reverse md:flex-row md:justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-700 mb-4 md:mb-0">
                CSI Event Attendance
              </h2>
              <img src={CSILogo} alt="CSI Logo" className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            {ename && (
              <p className="text-xl text-center font-bold pb-4">
                Attendance for {ename}
              </p>
            )}

            {isWithinRadius ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border-gray-300 border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border-gray-300 border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="studentId">
                      Student ID <span className="text-sm from-bold ml-3">for e.g:- 2021FHCO131</span>
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="w-full border-gray-300 border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="department">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full border-gray-300 border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="computer">Computer</option>
                      <option value="it">IT</option>
                      <option value="aids">AIDS</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="year">
                      Year
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full border-gray-300 border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="semester">
                      Semester
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full border-gray-300 border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    >
                      <option value="">Select Semester</option>
                      <option value={1}>1st Semester</option>
                      <option value={2}>2nd Semester</option>
                      <option value={3}>3rd Semester</option>
                      <option value={4}>4th Semester</option>
                      <option value={5}>5th Semester</option>
                      <option value={6}>6th Semester</option>
                      <option value={7}>7th Semester</option>
                      <option value={8}>8th Semester</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="mobileNo">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNo"
                      value={formData.mobileNo}
                      onChange={handleChange}
                      className="w-full border-gray-300 border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border-gray-300 border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="rollNo">
                      Roll No
                    </label>
                    <input
                      type="number"
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleChange}
                      className="w-full border-gray-300 border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="division">
                      Division
                    </label>
                    <select
                      name="division"
                      value={formData.division}
                      onChange={handleChange}
                      className="w-full border-gray-300 border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    >
                      <option value="">Select Division</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    Submit
                  </button>
                </div>



              </form>
            ) : (
              <div className="text-center text-red-600 font-bold">
                You are not within the required radius to submit attendance.
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={setCurrentLocationAsTarget}
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md mx-auto hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    Set Current Location
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalDetailsForm;
