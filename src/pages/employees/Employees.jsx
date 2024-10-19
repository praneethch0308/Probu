import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaPencilAlt, FaRegPlusSquare } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import EmployeeContext from "../../context/employees/EmployeeContext";
import Aos from "aos";
import "aos/dist/aos.css";
import { MdCancel, MdOutlineFileDownload } from "react-icons/md";
import { useSidebar } from "../../context/sidebar/SidebarContext";
import ExportToExcelButton from "../../components/ExcelButton";

const Employees = () => {
  const context = useContext(EmployeeContext);
  const { employees, getEmployees } = context;
const {isOpened}= useSidebar();
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 3; 

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  
  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    onOpenModal();
  };

  const navigate = useNavigate();
useEffect(()=>{
  if (localStorage.getItem("token")) {
    getEmployees();
  } else {
    navigate("/");
  }
},[])
   
 

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div>
        <div className="pb-10">
          <Mainnav />
        </div>
        <div>
        <Sidebar />
        <div className={`content-transition  ${isOpened ? "sidebar-opened mr-5" : "sidebar-closed mr-5"}`}>
          <div className="flex justify-end pt-14 pb-2">
            <div className="flex space-x-4 items-center mr-2">
                <input
                  type="search"
                  placeholder="search"
                  className="p-3 rounded-2xl border-2 border-black"
                />
               <ExportToExcelButton  tableId="EmployeeTable"/>
                <button className="flex items-center bg-black text-white rounded-2xl shadow-md p-3 font-semibold hover:bg-neutral-600" onClick={() => navigate('/employee-create')}>
                  <FaRegPlusSquare className="h-6 w-6 mr-2" />
                  Create Employee
                </button>
              </div>
            </div>
            <div className="pt-10 p-5 flex justify-center">
              <table id="EmployeeTable" className="w-full table-auto shadow-md">
                <thead className="bg-black  rounded-t-lg">
                  <tr>
                    <th className="text-white py-2 px-5">Image</th>
                    <th className="text-white px-5">Employee ID</th>
                    <th className="text-white px-5">Name</th>
                    <th className="text-white px-5">Status</th>
                    <th className="text-white px-5">Phone Number</th>
                    <th className="text-white px-5 ">Email</th>
                    <th className="text-white px-5">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-50 content-center">
                  {currentEmployees && currentEmployees.length > 0 ? (
                    currentEmployees.map((employee) => (
                      <tr key={employee.id} className="p-5 border-b">
                        <td className="px-5 py-2">
                          <img
                            src={employee.empImageUrl}
                            alt="Employee"
                            className="h-10 w-10 rounded-full"
                          />
                        </td>
                        <td className="text-center font-normal p-4 px-16">{employee.empId}</td>
                        <td className="text-center font-normal p-2">
                          {employee.firstName} {employee.lastName}
                        </td>
                        <td className="text-center font-normal p-2">{employee.status}</td>
                        <td className="text-center font-normal p-2">{employee.phoneNumber}</td>
                        <td className="text-center font-normal p-2">{employee.email}</td>
                        <td className="text-center font-normal p-2">
                          <button
                            onClick={() => handleViewEmployee(employee)}
                            className="text-black hover:text-gray-800 p-2"
                          >
                            <FaEye />
                          </button>
                          <button className="text-black hover:text-gray-800 p-2">
                            <FaPencilAlt onClick={() => { navigate('/employee-update',{state:{employee}})  }} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil(employees.length / employeesPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-black text-white' : 'bg-white text-black border border-black'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          {open && selectedEmployee && (
            <div
              onClick={onCloseModal}
              className={`fixed inset-0 ml-28 mt-5 flex justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"
                }`}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white w-2/3 rounded-xl shadow-sm shadow-black p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"
                  }`}
              >
                <div className="flex items-center ">
                  <div className="px-8 w-1/3">
                    <img
                      src={selectedEmployee.empImageUrl}
                      alt="Client"
                      className="h-36 w-36 rounded-full justify-center"
                    />
                    <h1 className="text-center">{selectedEmployee.firstName}</h1>
                  </div>
                  <div className="w-2/3">
                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Status</div>
                      <div className=" ">:</div>
                      <div className=" pl-4">{selectedEmployee.status}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Emp ID</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedEmployee.empId}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">DOB</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedEmployee.dob}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Date of Joining</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedEmployee.doj}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Phone Number</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedEmployee.phoneNumber}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Email</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedEmployee.email}</div>
                    </div>
                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Designation</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedEmployee.designation}</div>
                    </div>

                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Manager Name</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedEmployee.managerName}</div>
                    </div>
                    <div className="flex pb-3">
                      <div className="w-1/3 font-semibold">Is Manager</div>
                      <div className="">:</div>
                      <div className="pl-4">{selectedEmployee.manager}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onCloseModal}
                  className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
                >
                  <MdCancel />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Employees;
