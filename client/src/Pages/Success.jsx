import React from "react";
import SuccessImage from "../assets/images/success.png"; // Adjust the path as needed
import InstagramLogo from "../assets/images/instagram.png"; // Adjust the path as needed

const Success = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0f8ff] p-4">
      <div className="relative bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          🎉 Success! 🎉
        </h2>
        <img 
          src={SuccessImage} 
          alt="Success" 
          className="w-24 h-24 mx-auto mb-4" 
        />
        <p className="text-gray-700 mb-4 text-lg">
          Your attendance has been recorded successfully! ✅
        </p>
        <p className="text-gray-700 mb-4 text-lg">
          Thanks for attending the session! On behalf of the CSI team, we hope you found it valuable and engaging. 🙌
        </p>
        <p className="text-gray-700 mb-4 text-lg">
          For more such events and workshops, kindly follow our Instagram page: 📸
        </p>
        <div className="flex justify-center items-center">
          <a 
            href="https://www.instagram.com/csidmce/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-blue-600 hover:underline text-lg font-semibold"
          >
            <img 
              src={InstagramLogo} 
              alt="Instagram" 
              className="w-6 h-6 mr-2" 
            />
            <span className="italic">@csidmce</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Success;
