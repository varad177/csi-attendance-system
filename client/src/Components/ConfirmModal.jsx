

import React from "react";

const Modal = ({ isVisible, formData, onClose, onConfirm }) => {
  if (!isVisible) return null;

  return (
    <div className="w-full fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 md:w-full max-w-md relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Confirm Submission</h2>
          <button
            className="text-gray-600 hover:text-gray-800 transition duration-150"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 border border-gray-200 p-4 rounded-lg">
          <div className="border-b border-gray-200 pb-2">
            <p className="font-medium">First Name:</p>
            <p>{formData.firstName}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <p className="font-medium">Last Name:</p>
            <p>{formData.lastName}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <p className="font-medium">Student ID:</p>
            <p>{formData.studentId}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <p className="font-medium">Department:</p>
            <p>{formData.department}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <p className="font-medium">Year:</p>
            <p>{formData.year}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <p className="font-medium">Semester:</p>
            <p>{formData.semester}</p>
          </div>
          <div className="border-b border-gray-200 pb-2">
            <p className="font-medium">Roll No:</p>
            <p>{formData.rollNo}</p>
          </div>
          <div>
            <p className="font-medium">Division:</p>
            <p>{formData.division}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150"
            onClick={onConfirm}
          >
            Confirm Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
