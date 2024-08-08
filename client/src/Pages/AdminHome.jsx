import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const AdminHome = () => {
    const [otp, setOtp] = useState({
        ename: "",
        otp: ""
    });
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const dataInSession = sessionStorage.getItem("csiAdmin");
        if (!dataInSession) {
            navigate('/admin/login');
            return; // Ensure the effect stops executing after navigation
        }

        const active = JSON.parse(dataInSession).active;
        setIsActive(active);
    }, [navigate]); // Only navigate is in the dependencies array

    const handleOtpChange = (e) => {
        const { name, value } = e.target;
        setOtp(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        const dataInSession = sessionStorage.getItem("csiAdmin");
        const active = JSON.parse(dataInSession).active;
        setIsActive(active);
    }, []);

    const addOtp = () => {
        const dataInSession = sessionStorage.getItem("csiAdmin");
        const email = JSON.parse(dataInSession).email;
        const password = JSON.parse(dataInSession).token;

        let data = JSON.stringify({
            email: email,
            ename: otp.ename,
            otp: otp.otp,
            password: password
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/admin/add-otp',
            headers: {
                'Content-Type': 'application/json'
            },
            data
        };

        axiosInstance.request(config)
            .then((response) => {
                toast.success(response.data.message);
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "An error occurred");
            });
    };

    const toggleActive = () => {
        const dataInSession = sessionStorage.getItem("csiAdmin");
        const email = JSON.parse(dataInSession).email;
        const active = JSON.parse(dataInSession).active;

        let data = JSON.stringify({ email, active: !active });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/admin/toggle-active',
            headers: {
                'Content-Type': 'application/json'
            },
            data
        };

        axiosInstance.request(config)
            .then((response) => {
                setIsActive(!isActive);
                let dataInSession = sessionStorage.getItem("csiAdmin");
                let data = JSON.parse(dataInSession);
                data.active = response.data.active;
                sessionStorage.setItem("csiAdmin", JSON.stringify(data));
                
                toast.success(response.data.message);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    const setLocation = () => {
        if (!navigator.geolocation) {
            return toast.error("Geolocation is not supported by this browser.");
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const dataInSession = sessionStorage.getItem("csiAdmin");
                const email = JSON.parse(dataInSession).email;

                let data = JSON.stringify({
                    email: email,
                    latitude: latitude,
                    longitude: longitude
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: '/set-location',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data
                };

                try {
                    const response = await axiosInstance.request(config);
                    toast.success("Location set successfully!");
                } catch (err) {
                    console.error("Failed to set location:", err);
                    toast.error("Failed to set location.");
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                toast.error("Failed to retrieve location.");
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">🔑 Admin Home</h1>
                <div className="mb-4">
                    <label htmlFor="otp" className="block text-gray-700 font-medium mb-2 text-lg">Enter OTP:</label>
                    <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp.otp}
                        onChange={handleOtpChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="Ename" className="block text-gray-700 font-medium mb-2">Enter Event Name:</label>
                    <input
                        type="text"
                        id="Ename"
                        name="ename"
                        value={otp.ename}
                        onChange={handleOtpChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                    <button
                        onClick={addOtp}
                        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    >
                        Add Event
                    </button>
                </div>
                <div>
                    <button
                        onClick={toggleActive}
                        className={`w-full py-2 px-4 rounded-md ${!isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white focus:outline-none focus:ring-2 focus:ring-${!isActive ? 'red' : 'green'}-500 text-lg`}
                    >
                        {isActive ? '🔒 Deactivate' : '🔓 Activate'}
                    </button>
                    <button
                        onClick={() => navigate('/admin/all-students')}
                        className="mt-4 w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        Present Students
                    </button>
                    <button
                        onClick={setLocation}
                        className="mt-4 w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        Set Location
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
