// import React, { useEffect, useState } from 'react';
// import { Modal, Button, Input, Select } from 'antd';
// import axiosInstance from '../../axiosInstance';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { CSVLink } from 'react-csv';
// import logo from '../assets/images/CSI_LOGO.png';

// const { Option } = Select;

// const AllStudent = () => {
//   const [students, setStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [filter, setFilter] = useState({ year: '', division: '', department: '' });
//   const [departments, setDepartments] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [eventName, setEventName] = useState('');
//   const [eventDate, setEventDate] = useState('');
//   const [csvData, setCsvData] = useState([]);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axiosInstance.get('/student/all-student');
//         const studentData = response.data.users;
//         setStudents(studentData);
//         setFilteredStudents(studentData);

//         // Extract unique departments
//         const uniqueDepartments = Array.from(new Set(studentData.map(student => student.department)));
//         setDepartments(uniqueDepartments);
//       } catch (error) {
//         console.error('Error fetching data', error);
//       }
//     };

//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     filterStudents();
//   }, [filter, students]);

//   const filterStudents = () => {
//     const filtered = students.filter(student => {
//       return (
//         (filter.department ? student.department === filter.department : true) &&
//         (filter.year ? student.year === filter.year : true) &&
//         (filter.division ? student.div === filter.division : true)
//       );
//     });

//     const sorted = filtered.sort((a, b) => a.roll - b.roll);
//     setFilteredStudents(sorted);

//     const csv = sorted.map(student => ({
//       'First Name': student.firstname,
//       'Last Name': student.lastname,
//       'Student ID': student.studentid,
//       'Department': student.department,
//       'Year': student.year,
//       'Semester': student.sem,
//       'Division': student.div,
//       'Roll': student.roll
//     }));
//     setCsvData(csv);
//   };

//   const handleFilterChange = (name, value) => {
//     setFilter(prevFilter => ({ ...prevFilter, [name]: value }));
//   };

//   const handleModalSubmit = () => {
//     generatePDF();
//     setIsModalVisible(false);
//   };

//   const generatePDF = () => {
//     if (!eventName || !eventDate) {
//       alert("Please enter both event name and date.");
//       return;
//     }

//     const doc = new jsPDF();
//     doc.setFont('Times New Roman');

//     // Header
//     doc.setFontSize(16);
//     doc.text('Computer Society of India\nStudent Chapter DMCE\nDepartment of Computer Engineering', 105, 40, { align: 'center' });

//     // Add logo
//     doc.addImage(logo, 'PNG', 160, 10, 30, 30);

//     // Department Details
//     const departmentNames = {
//       computer: 'Computer Engineering',
//       it: 'Information Technology',
//       aids: 'Artificial Intelligence and Data Science',
//     };

//     const departmentHeads = {
//       computer: 'Sir',
//       it: 'Ma\'am',
//       aids: 'Sir',
//     };

//     const departmentFullName = departmentNames[filter.department.toLowerCase()] || 'Engineering';
//     const departmentHead = departmentHeads[filter.department.toLowerCase()] || 'Sir/Ma\'am';

//     doc.setFontSize(14);
//     doc.setLineWidth(0.5);
//     doc.line(10, 55, 200, 55); // Adjusted line position

//     doc.setFontSize(12);
//     doc.text(`To,`, 10, 65);
//     doc.text(`The Head of Department,`, 10, 70);
//     doc.text(`Department of ${departmentFullName}`, 10, 75);

//     doc.setFontSize(12);
//     doc.text(`Subject: Attendance for ${eventName}`, 10, 85);

//     doc.setFontSize(12);
//     doc.text(`Dear ${departmentHead},`, 10, 95);
//     doc.text(`This is to inform you that the CSI event "${eventName}" was held on ${eventDate}.`, 10, 105);
//     doc.text(`The following students attended the event, and their details are attached in this report.`, 10, 115);
//     doc.text(`We request you to review the attendance and acknowledge the receipt.`, 10, 125);
//     doc.text(`The list of attendees is attached with this letter.`, 10, 135);

//     doc.text(`The event was well-received by all participants, and it successfully met its objectives of promoting knowledge`, 10, 145);
//     doc.text(`and networking among students. We appreciate your support in making such events possible.`, 10, 155);

//     doc.text(`Thank you for your cooperation.`, 10, 175);

//     doc.text(`Yours Sincerely,`, 10, 200);
//     doc.text(`Team CSI DMCE`, 10, 210);

//     // Signatures
//     const signatureY = doc.internal.pageSize.height - 30; // Adjusted position
//     doc.text(`General Secretary`, 10, signatureY);
//     doc.text(`Ms. Sneha Deshmukh`, 10, signatureY + 5);

//     doc.text(`Faculty Coordinator`, 140, signatureY);
//     doc.text(`Prof. Vaishali Gaidhane`, 140, signatureY + 5);

//     // New Page for Attendance
//     doc.addPage();
//     doc.setFontSize(14);
//     doc.text(`Department: ${departmentFullName}`, 10, 10);
//     doc.text(`Year: ${filter.year || 'All'}`, 10, 20);
//     doc.text(`Division: ${filter.division || 'All'}`, 10, 30);

//     autoTable(doc, {
//       startY: 40,
//       theme: 'grid',
//       headStyles: {
//         fillColor: [97, 94, 252], // Header background color (#615EFC)
//         textColor: [255, 255, 255], // Header text color (white)
//         fontSize: 12,
//         font: 'Times New Roman',
//         lineWidth: 0.5,
//         borderColor: [0, 0, 0], // Black borders for header
//       },
//       bodyStyles: {
//         fontSize: 10,
//         font: 'Times New Roman',
//         lineWidth: 0.5,
//         cellPadding: 2, // Reduced padding to fit content
//         halign: 'center',
//         valign: 'middle',
//       },
//       styles: {
//         cellPadding: 2, // Reduced padding to fit content
//         halign: 'center',
//         valign: 'middle',
//         lineWidth: 0.5,
//         borderColor: [0, 0, 0], // Black borders for body
//       },
//       head: [['First Name', 'Last Name', 'Student ID', 'Department', 'Year', 'Semester', 'Division', 'Roll']],
//       body: filteredStudents.map(student => [
//         capitalizeFirstLetter(student.firstname),
//         capitalizeFirstLetter(student.lastname),
//         student.studentid,
//         capitalizeFirstLetter(student.department),
//         student.year,
//         student.sem,
//         student.div,
//         student.roll,
//       ]),
//     });

//     let filename = 'All Students';
//     if (filter.department) {
//       filename = filter.department;
//       if (filter.year) {
//         filename += ` ${filter.year}`;
//         if (filter.division) {
//           filename += ` ${filter.division}`;
//         }
//       }
//     }
//     doc.save(`${filename}.pdf`);
//   };

//   // Capitalize the first letter of a string
//   const capitalizeFirstLetter = (string) => {
//     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
//   };


//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">All Students</h1>
//       <div className="flex items-center justify-between p-4">
//         <div className="flex space-x-4">
//           <div>
//             <label className="block mb-1">Select Department</label>
//             <Select
//               placeholder="Select Department"
//               value={filter.department}
//               onChange={value => handleFilterChange('department', value)}
//               className="w-full"
//             >
//               <Option value="">All Departments</Option>
//               {departments.map((department, index) => (
//                 <Option key={index} value={department.toLowerCase()}>
//                   {department.toUpperCase()}
//                 </Option>
//               ))}
//             </Select>
//           </div>
//           <div>
//             <label className="block mb-1">Select Year</label>
//             <Select
//               placeholder="Select Year"
//               value={filter.year}
//               onChange={value => handleFilterChange('year', value)}
//               className="w-full"
//             >
//               <Option value="">All Years</Option>
//               <Option value="1">1st Year</Option>
//               <Option value="2">2nd Year</Option>
//               <Option value="3">3rd Year</Option>
//               <Option value="4">4th Year</Option>
//             </Select>
//           </div>
//           <div>
//             <label className="block mb-1">Select Division</label>
//             <Select
//               placeholder="Select Division"
//               value={filter.division}
//               onChange={value => handleFilterChange('division', value)}
//               className="w-full"
//             >
//               <Option value="">All Divisions</Option>
//               <Option value="A">A</Option>
//               <Option value="B">B</Option>
//             </Select>
//           </div>
//         </div>
//         <div className="flex space-x-4">
//           <CSVLink data={csvData} filename={"students.csv"}>
//             <Button type="primary">
//               Export to CSV
//             </Button>
//           </CSVLink>
//           <Button
//             type="primary"
//             onClick={() => setIsModalVisible(true)}
//           >
//             Export to PDF
//           </Button>
//         </div>
//       </div>
//       <p className="text-xl">No of students {filteredStudents.length}</p>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200 mt-4">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Division</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredStudents.map((student, index) => (
//               <tr key={index}>
//                 <td className="px-6 py-4 whitespace-nowrap">{student.firstname}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{student.lastname}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{student.studentid}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{student.department}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{student.year}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{student.sem}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{student.div}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{student.roll}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <Modal
//         title="Event Details"
//         visible={isModalVisible}
//         onOk={handleModalSubmit}
//         onCancel={() => setIsModalVisible(false)}
//       >
//         <div>
//           <label className="block mb-1">Event Name</label>
//           <Input
//             placeholder="Enter Event Name"
//             value={eventName}
//             onChange={(e) => setEventName(e.target.value)}
//           />
//         </div>
//         <div className="mt-4">
//           <label className="block mb-1">Event Date</label>
//           <Input
//             type="date"
//             placeholder="Enter Event Date"
//             value={eventDate}
//             onChange={(e) => setEventDate(e.target.value)}
//           />
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default AllStudent;


import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import logo from '../assets/images/CSI_LOGO.png';

const AllStudent = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filter, setFilter] = useState({ year: '', division: '', department: '' });
  const [departments, setDepartments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.post('/student/all-student');
        console.log(response);
        
        const studentData = response.data.users;
        setStudents(studentData);
        setFilteredStudents(studentData);

        // Extract unique departments
        const uniqueDepartments = Array.from(new Set(studentData.map(student => student.department)));
        setDepartments(uniqueDepartments);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [filter, students]);

  const filterStudents = () => {
    const filtered = students.filter(student => {
      return (
        (filter.department ? student.department === filter.department : true) &&
        (filter.year ? student.year === filter.year : true) &&
        (filter.division ? student.div === filter.division : true)
      );
    });

    const sorted = filtered.sort((a, b) => a.roll - b.roll);
    setFilteredStudents(sorted);

    const csv = sorted.map(student => ({
      'First Name': student.firstname,
      'Last Name': student.lastname,
      'Student ID': student.studentid,
      'Department': student.department,
      'Year': student.year,
      'Semester': student.sem,
      'Division': student.div,
      'Roll': student.roll
    }));
    setCsvData(csv);
  };

  const handleFilterChange = (name, value) => {
    setFilter(prevFilter => ({ ...prevFilter, [name]: value }));
  };

  const handleModalSubmit = () => {
    generatePDF();
    setIsModalVisible(false);
  };

  const generatePDF = () => {
    if (!eventName || !eventDate) {
      alert("Please enter both event name and date.");
      return;
    }

    const doc = new jsPDF();
    doc.setFont('Times New Roman');

    // Header
    doc.setFontSize(16);
    doc.text('Computer Society of India\nStudent Chapter DMCE\nDepartment of Computer Engineering', 105, 40, { align: 'center' });

    // Add logo
    doc.addImage(logo, 'PNG', 160, 10, 30, 30);

    // Department Details
    const departmentNames = {
      computer: 'Computer Engineering',
      it: 'Information Technology',
      aids: 'Artificial Intelligence and Data Science',
    };

    const departmentHeads = {
      computer: 'Sir',
      it: 'Ma\'am',
      aids: 'Sir',
    };

    const departmentFullName = departmentNames[filter.department.toLowerCase()] || 'Engineering';
    const departmentHead = departmentHeads[filter.department.toLowerCase()] || 'Sir/Ma\'am';

    doc.setFontSize(14);
    doc.setLineWidth(0.5);
    doc.line(10, 55, 200, 55); // Adjusted line position

    doc.setFontSize(12);
    doc.text(`To,`, 10, 65);
    doc.text(`The Head of Department,`, 10, 70);
    doc.text(`Department of ${departmentFullName}`, 10, 75);

    doc.setFontSize(12);
    doc.text(`Subject: Attendance for ${eventName}`, 10, 85);

    doc.setFontSize(12);
    doc.text(`Dear ${departmentHead},`, 10, 95);
    doc.text(`This is to inform you that the CSI event "${eventName}" was held on ${eventDate}.`, 10, 105);
    doc.text(`The following students attended the event, and their details are attached in this report.`, 10, 115);
    doc.text(`We request you to review the attendance and acknowledge the receipt.`, 10, 125);
    doc.text(`The list of attendees is attached with this letter.`, 10, 135);

    doc.text(`The event was well-received by all participants, and it successfully met its objectives of promoting knowledge`, 10, 145);
    doc.text(`and networking among students. We appreciate your support in making such events possible.`, 10, 155);

    doc.text(`Thank you for your cooperation.`, 10, 175);

    doc.text(`Yours Sincerely,`, 10, 200);
    doc.text(`Team CSI DMCE`, 10, 210);

    // Signatures
    const signatureY = doc.internal.pageSize.height - 30; // Adjusted position
    doc.text(`General Secretary`, 10, signatureY);
    doc.text(`Ms. Sneha Deshmukh`, 10, signatureY + 5);

    doc.text(`Faculty Coordinator`, 140, signatureY);
    doc.text(`Prof. Vaishali Gaidhane`, 140, signatureY + 5);

    // New Page for Attendance
    doc.addPage();
    doc.setFontSize(14);
    doc.text(`Department: ${departmentFullName}`, 10, 10);
    doc.text(`Year: ${filter.year || 'All'}`, 10, 20);
    doc.text(`Division: ${filter.division || 'All'}`, 10, 30);

    autoTable(doc, {
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: [97, 94, 252], // Header background color (#615EFC)
        textColor: [255, 255, 255], // Header text color (white)
        fontSize: 12,
        font: 'Times New Roman',
        lineWidth: 0.5,
        borderColor: [0, 0, 0], // Black borders for header
      },
      bodyStyles: {
        fontSize: 10,
        font: 'Times New Roman',
        lineWidth: 0.5,
        cellPadding: 2, // Reduced padding to fit content
        halign: 'center',
        valign: 'middle',
      },
      styles: {
        cellPadding: 2, // Reduced padding to fit content
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.5,
        borderColor: [0, 0, 0], // Black borders for body
      },
      head: [['First Name', 'Last Name', 'Student ID', 'Department', 'Year', 'Semester', 'Division', 'Roll']],
      body: filteredStudents.map(student => [
        capitalizeFirstLetter(student.firstname),
        capitalizeFirstLetter(student.lastname),
        student.studentid,
        capitalizeFirstLetter(student.department),
        student.year,
        student.sem,
        student.div,
        student.roll,
      ]),
    });

    let filename = 'All Students';
    if (filter.department) {
      filename = filter.department;
      if (filter.year) {
        filename += ` ${filter.year}`;
        if (filter.division) {
          filename += ` ${filter.division}`;
        }
      }
    }
    doc.save(`${filename}.pdf`);
  };

  // Capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Students</h1>
      <div className="flex items-center justify-between p-4">
        <div className="flex space-x-4">
          <div>
            <label className="block mb-1">Select Department</label>
            <select
              value={filter.department}
              onChange={e => handleFilterChange('department', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Departments</option>
              {departments.map((department, index) => (
                <option key={index} value={department.toLowerCase()}>
                  {department.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Select Year</label>
            <select
              value={filter.year}
              onChange={e => handleFilterChange('year', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Select Division</label>
            <select
              value={filter.division}
              onChange={e => handleFilterChange('division', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Divisions</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
        </div>
        <div>
          <button
            onClick={() => setIsModalVisible(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Download Attendance
          </button>
          <CSVLink
            data={csvData}
            filename="students.csv"
            className="bg-green-600 text-white py-2 px-4 rounded ml-2"
          >
            Download CSV
          </CSVLink>
        </div>
      </div>
      <h1 className='p-4 text-black font-bold'> The no of student {filteredStudents.length && filteredStudents.length}</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200 text-black text-sm leading-normal">

            <th className="py-3 px-6 text-left">First Name</th>
            <th className="py-3 px-6 text-left">Last Name</th>
            <th className="py-3 px-6 text-left">Student ID</th>
            <th className="py-3 px-6 text-left">Department</th>
            <th className="py-3 px-6 text-left">Year</th>
            <th className="py-3 px-6 text-left">Semester</th>
            <th className="py-3 px-6 text-left">Division</th>
            <th className="py-3 px-6 text-left">Roll</th>
          </tr>
        </thead>
        <tbody className="text-black text-sm font-light">
          {filteredStudents.map((student, index) => (
            <tr key={index} className="border-b text-black border-gray-200 hover:bg-gray-100">

              <td className="py-3 px-6 text-left">{capitalizeFirstLetter(student.firstname)}</td>
              <td className="py-3 px-6 text-left">{capitalizeFirstLetter(student.lastname)}</td>
              <td className="py-3 px-6 text-left">{student.studentid}</td>
              <td className="py-3 px-6 text-left">{capitalizeFirstLetter(student.department)}</td>
              <td className="py-3 px-6 text-left">{student.year}</td>
              <td className="py-3 px-6 text-left">{student.sem}</td>
              <td className="py-3 px-6 text-left">{student.div}</td>
              <td className="py-3 px-6 text-left">{student.roll}</td>

            </tr>
          ))}
        </tbody>
      </table>
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Event Details</h2>
            <div className="mb-4">
              <label className="block mb-1">Event Name</label>
              <input
                type="text"
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalVisible(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="bg-blue-600 text-white py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStudent;
