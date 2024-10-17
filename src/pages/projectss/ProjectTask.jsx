import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import { MdModeEditOutline } from "react-icons/md";
import EmployeeContext from "../../context/employees/EmployeeContext";
import { FaEye, FaList, FaPencilAlt } from "react-icons/fa";
import { useSidebar } from "../../context/sidebar/SidebarContext";
import Aos from "aos";
import "aos/dist/aos.css";
import { FaCalendar, FaIndianRupeeSign, FaRupeeSign } from "react-icons/fa6";


const ProjectTask = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { project } = location.state || {};
  const [activeTab, setActiveTab] = useState("Task"); 

  const context = useContext(EmployeeContext);
  const { employees, getEmployees } = context;
  const { isOpened } = useSidebar();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getEmployees();
    } else {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const role = localStorage.getItem('role')

  const renderTable = () => {
    switch (activeTab) {
      case "Task":
        return (
          <table className="md:mr-10 table-auto border-2 w-full border-black ">
            <thead className="bg-black  rounded-t-lg">
              <tr>
                <th className="text-white px-4">Task ID</th>
                <th className="text-white px-4 ">Title</th>
                <th className="text-white px-4">Status</th>
                <th className="text-white px-4">Created Date</th>
                <th className="text-white px-4">Project</th>
                <th className="text-white px-4">Created By</th>
                <th className="text-white px-4">Assigned By</th>
                <th className="text-white px-4">Assigned To </th>
              </tr>
            </thead>
          </table>
        );
      case "Employee":
        return (          
          <div>
            {role !== "USER" && (
              <button className="px-4 py-2 bg-green-500 text-white font-bold rounded mb-4">+Add</button>
            )}
            <table className="md:mr-10 table-auto border-2 border-black ">
            
            <thead className="bg-black  rounded-t-lg">
              <tr>
                <th className="text-white w-20 px-4">Employee ID</th>
                <th className="text-white px-4">Name</th>
                <th className="text-white px-4">Status</th>
                <th className="text-white px-4">Phone Number</th>
                <th className="text-white px-4">Email</th>
                <th className="text-white px-4">Manager Name</th>
              </tr>
            </thead>
          </table>
          </div>
        );
      case "Vendor":
        return (
          <table className="md:mr-10 table-auto border-2 border-black ">
            <thead className="bg-black  rounded-t-lg">
              <tr>
                <th className="text-white w-20 px-4">Vendor Name</th>
                <th className="text-white px-4 ">Vendor Code</th>
                <th className="text-white px-4">GST No</th>
                <th className="text-white px-4">PAN Number</th>
                <th className="text-white px-4">Status</th>
                <th className="text-white px-4">City</th>
                <th className="text-white px-4">District</th>
                <th className="text-white px-4">State</th>
              </tr>
            </thead>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="pb-10 ">
        <Mainnav />
      </div>
      <div>
        <Sidebar />
        <div className="w-full">
          <div className="pt-10 flex justify-center ml-20">
            <h1 className="text-3xl text-center font-semibold">Project Details</h1>
            
          </div>
          {project ? (
            <div className={`content-transition flex mt-10 ${isOpened ? 'sidebar-opened' : 'sidebar-closed'}`}>
              <div className="border-[2px]  ml-5 mr-5 shadow-md rounded-3xl p-6 w-1/3">
                <div className="flex justify-between ">
                  <div className="flex justify-normal">
                  <div><FaList className="h-5 w-5"/></div>
                  <h2 className="text-xl font-bold -mt-1 mb-2  ml-3">Details</h2>
                  </div> 
                
                  <div className="cursor-pointer"><MdModeEditOutline /></div>
                </div>
                <p>
                  <strong>Project Name:</strong> {project.projectName}
                </p>
                <p className="pt-3">
                  <strong>Project Code:</strong> {project.projectCode}
                </p>
                <p className="pt-3">
                  <strong>Vertical:</strong> {project.vertical}
                </p>
                <p className="pt-3">
                  <strong>Manager:</strong> {project.projectManager}
                </p>
                <p className="pt-3">
                  <strong>Description:</strong> {project.projectDescription}
                </p>
                <p className="pt-3">
                  <strong>Client:</strong> {project.clientObjId}
                </p>
              </div>

              <div className="bg-white border-[2px] ml-5 mr-5 shadow-md rounded-3xl p-6 w-1/3">
                <div className="flex justify-start">
                  <div><FaCalendar className="h-5 w-5"/></div>
                <h2 className="text-xl font-bold -mt-1 ml-2 mb-4">Project-Cycle</h2>
                  </div>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(project.startDate).toLocaleDateString()}
                </p>
                <p className="pt-3">
                  <strong>End Date:</strong>{" "}
                  {new Date(project.endDate).toLocaleDateString()}
                </p>
                <p className="pt-3">
                  <strong>Actual End Date:</strong>{" "}
                  {new Date(project.actualEndDate).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-white border-[2px] ml-5 mr-5 shadow-md rounded-3xl p-6 w-1/3">
                <div className="flex justify-between">
                <div className="flex justify-normal">
                  <div><FaIndianRupeeSign className="h-5 w-5"/></div>
                  <h2 className="text-xl font-bold -mt-1 mb-2  ml-3">Planned Budget Details</h2>
                  </div>
                  <div className="cursor-pointer"><MdModeEditOutline /></div>
                </div>
                <p>
                  <strong>Allocated Budget:</strong> {project.allocatedBudget}
                </p>
                <p className="pt-3">
                  <strong>GST Amount:</strong> {project.gstAmt}
                </p>
                <p className="pt-3">
                  <strong>Spent Budget:</strong> {project.spentBudget}
                </p>
                <p className="pt-3">
                  <strong>Spent Budget GST:</strong> {project.spentBudgetGst}
                </p>
              </div>
            </div>
          ) : (
            <div className="pt-10 flex justify-center">
              <p>No project data available.</p>
            </div>
          )}
          <div className={`content-transition p-4 ${isOpened ? 'sidebar-opened' : 'sidebar-closed'}`}>
            <div className="mb-4 flex space-x-2">
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "Task" ? "bg-black text-white" : "bg-slate-100"
                }`}
                onClick={() => setActiveTab("Task")}
              >
                Task
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "Employee" ? "bg-black text-white" : "bg-slate-100"
                }`}
                onClick={() => setActiveTab("Employee")}
              >
                Employee
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "Vendor" ? "bg-black text-white" : "bg-slate-100"
                }`}
                onClick={() => setActiveTab("Vendor")}
              >
                Vendor
              </button>
            </div>
            {renderTable()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTask;
