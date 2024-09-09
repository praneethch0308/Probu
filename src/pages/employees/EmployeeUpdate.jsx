
  

 


import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import 'tailwindcss/tailwind.css';
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import EmployeeContext from "../../context/employees/EmployeeContext";
import { Employee, EmployeeUpdatedata } from "../../context/employees/EmployeeState";
import ClientContext from "../../context/clients/ClientContext";
import ProjectContext from "../../context/projects/ProjectsContext";
import { useSidebar } from "../../context/sidebar/SidebarContext";
import axios from "axios";



const EmployeeUpdate = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const orgId = localStorage.getItem('orgId');
    const username = localStorage.getItem('loggedUser');
  



    const navigate = useNavigate();
    const context = useContext(EmployeeContext);
    const { EmployeeInitData, initialData, empUpdate } = context;
    const { designations = [], projects = [], teams = [] } = initialData || {};
    const location = useLocation();
    const {
      state: { employee },
    } = location;
    const host = "http://157.245.110.240:8080/ProBuServices";
    const accessToken= localStorage.getItem('token');
    const {
      register,
      handleSubmit,
      reset
    } = useForm({
      defaultValues: {
        firstName: employee?.firstName || "", 
        lastName: employee?.lastName || "", 
        middleName:employee?.middleName||"",
        DateofBirth: employee?.dob || "", 
        DateofJoining: employee?.doj || "", 
        phoneNumber: employee?.phoneNumber || "", 
        Email: employee?.email || "", 
        Designation: employee?.designation || "", 
        Project: employee?.projects || 0, 
        TeamSelection: employee?.teams || 0, 
        IsManager: employee?.IsManager || "", 
              
      },
    });
  
    useEffect(() => {
      reset({
        firstName: employee?.firstName || "", 
        lastName: employee?.lastName || "", 
        middleName:employee?.middleName||"",
        DateofBirth: employee?.dob || "", 
        DateofJoining: employee?.doj || "", 
        phoneNumber: employee?.phoneNumber || "", 
        Email: employee?.email || "", 
        Designation: employee?.designation || "", 
        Project: employee?.projects || 0, 
        TeamSelection: employee?.teams || 0, 
        IsManager: employee?.IsManager || "", 
      });
    }, [employee, reset]);
 
    const onSubmit = async (data) => {
        try {
            const empUpdateData = new EmployeeUpdatedata();
                empUpdateData.emp.id=employee.id;
                empUpdateData.emp.firstName= data.firstName;
                empUpdateData.emp.middleName= data.middleName || '';
                empUpdateData.emp.lastName= data.lastName;
                empUpdateData.emp.empId= employee.empId;
                empUpdateData.emp.empImageUrl=employee.empImageUrl;
                empUpdateData.emp.dob= new Date(data.DateofBirth).toISOString().split('T')[0];
                empUpdateData.emp.doj= new Date(data.DateofJoining).toISOString().split('T')[0];
                empUpdateData.emp.phoneNumber= data.phoneNumber;
                empUpdateData.emp.email= data.Email;
                empUpdateData.emp.designation= data.Designation;
                empUpdateData.emp.status= "Active";
                empUpdateData.emp.manager= data.IsManager||false,
                empUpdateData.emp.managerObjId= data.Manager || "";
                empUpdateData.emp.managerName= data.Manager || "";
                empUpdateData.emp.hourlyRate=employee.hourlyRate;
                empUpdateData.emp.teams= [data.TeamSelection];
                empUpdateData.emp.orgId= employee.orgId;
                empUpdateData.emp.projects= [data.Project];
                empUpdateData.emp.userObjId=employee.userObjId;
                empUpdateData.username= username;
                empUpdateData.orgId=orgId
                console.log("Employee Create Data:", empUpdateData);

              
    
                const response = await axios.post(`${host}/employee/update?access_token=${accessToken}`,(empUpdateData),
                 

                 
                );
                console.log('Response:', response);
                setToast({ message: 'Employee updated successfully!', type: 'success' });
                setTimeout(() => {
                    navigate("/employees");
                }, 2000);
    
         
            }


        
         catch (error) {
            console.error('Error creating employee:', error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
       
       
        
          EmployeeInitData();
        } else {
          navigate("/projects");
        }
      }, []);

    return (
        <div>
            <div className="pb-10">
                <Mainnav />
            </div>
            <div className="flex justify-between">
                <Sidebar />
                <div className="mr-8 md:mr-24 mt-10 w-2/3 items-center">
                    <div className="bg-gradient-to-r from-black to-neutral-400 p-3 rounded-lg font-bold text-white text-center text-3xl">
                        <p>EMPLOYEE UPDATE</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-neutral-300 p-4 rounded-lg mt-5 w-full">
                        <div className="md:flex justify-between">
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">First Name</label>
                                <input 
                                    type="text"
                                    {...register('firstName')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Middle Name</label>
                                <input
                                    type="text"
                                    {...register('middleName')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                               
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Last Name</label>
                                <input
                                    type="text"
                                    {...register('lastName')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                             
                            </div>
                        </div>
                        <div className="md:flex justify-between">
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Date of Birth</label>
                                <input
                                    type="date"
                                    {...register('DateofBirth')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                               
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Date of Joining</label>
                                <input
                                    type="date"
                                    {...register('DateofJoining')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                               
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Phone Number</label>
                                <input
                                    type="text"
                                    {...register('phoneNumber')}
                                    className="w-full px-3 py-2 border rounded"
                                    maxLength={10}
                                />
                               
                            </div>
                        </div>
                        <div className="md:flex justify-between">
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Email ID</label>
                                <input
                                    type="email"
                                    {...register('Email')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                             
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Designation</label>
                                <select {...register('Designation')} className="w-full px-3 py-2 border rounded">
                                    <option value="" disabled>Select Designation</option>
                                    {designations.map(designation => (
                                        <option key={designation.listItem} value={designation.listItem}>{designation.listItem}</option>
                                    ))}
                                </select>
                            
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Project</label>
                                <select {...register('Project')} className="w-full px-3 py-2 border rounded">
                                    <option value="" disabled>Select Project</option>
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id}>{project.projectName}</option>
                                    ))}
                                </select>
                               
                            </div>
                        </div>
                        <div className="md:flex justify-between">
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Team Selection</label>
                                <select {...register('TeamSelection')} className="w-full px-3 py-2 border rounded">
                                    <option value="" disabled>Select Team</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>{team.teamName}</option>
                                    ))}
                                </select>
                               
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg ml-5">
                                <label className="block text-black">Manager</label>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        {...register('Manager')}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                    <div className="flex items-center ml-2">
                                        <input
                                            type="checkbox"
                                            {...register('IsManager')}
                                            className="mr-2"
                                        />
                                        <label className="text-black">Is Manager</label>
                                    </div>
                                </div>
                             
                            </div>
                        </div>
                        {/* <div className="mb-4">
                            <label className="ml-4">Choose Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                            {selectedImage && <img src={selectedImage} alt="Profile Preview" className="w-24 h-24 mt-4" />}
                        </div> */}
                        <div className="flex justify-center">
                            <button type="submit" className="mr-40 p-2 rounded-md justify-center bg-black hover:bg-white hover:text-black text-white py-2">Update Employee</button>
                            <button type="button" onClick={() => navigate('/employees')} className="p-2 bg-black hover:bg-white hover:text-black text-white py-2 rounded-md">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EmployeeUpdate;
