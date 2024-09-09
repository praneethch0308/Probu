import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import 'tailwindcss/tailwind.css';
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import EmployeeContext from "../../context/employees/EmployeeContext";
import { Employee } from "../../context/employees/EmployeeState";

const EmployeeSchema = z.object({
    firstName: z.string().min(1, "Firstname is required"),
    lastName: z.string().min(1, 'Lastname is required'),
    DateofBirth: z.string().refine(val => !isNaN(Date.parse(val)), 'Enter valid date'),
    DateofJoining: z.string().refine(val => !isNaN(Date.parse(val)), 'Enter valid date'),
    phoneNumber: z.string().min(10, "Contact mobile number must be 10 digits").max(10, "Contact mobile number must be 10 digits"),
    Email: z.string().email('Enter valid email'),
    Designation: z.string().min(1, 'Select Designation'),
    Project: z.string().min(1, 'Select project'),
    TeamSelection: z.string().min(1, 'Select Team'),
    Manager: z.string().optional(),
    IsManager: z.boolean().optional(),
});

const EmployeeCreate = () => {
    const [selectedImage, setSelectedImage] = useState(new Image);
    const orgId = localStorage.getItem('orgId');
    const username = localStorage.getItem('loggedUser');
    const [fileUrl, setFileUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(EmployeeSchema)
    });

    const navigate = useNavigate();
    const context = useContext(EmployeeContext);
    const { EmployeeInitData, initialData, empCreate } = context;
    const { designations = [], projects = [], teams = [] } = initialData || {};
const emp= new Employee();
const handleImageChange = (event) => {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = setSelectedImage(event.target.files[0]);
      setSelectedFile(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFileUrl(reader.result);
      }; 
      setFileName(file.name);
    }
  };




    const onSubmit = async (data) => {
        try {
            const empCreateData = {
                firstName: data.firstName,
                middleName: data.middleName || '',
                lastName: data.lastName,
                empId: "",
                dob: new Date(data.DateofBirth).toISOString().split('T')[0],
                doj: new Date(data.DateofJoining).toISOString().split('T')[0],
                phoneNumber: data.phoneNumber,
                email: data.Email,
                designation: data.Designation,
                status: "Active",
                isManager: data.IsManager||"false",
                managerObjId: data.Manager || "",
                managerName: data.Manager || "",
                teamObjIds: [data.TeamSelection] || [],
                orgId: orgId,
                projObjId: data.Project,
                userName: username,
    
         
            }


            console.log("Employee Create Data:", empCreateData);

            const formData = new FormData();
            formData.append("empCreateData", JSON.stringify(empCreateData));

            if (selectedImage) {
                formData.append('empImage',selectedImage);
            }

            const response = await empCreate(formData);
            console.log('Response:', response);
            navigate('/employees');
        } catch (error) {
            console.error('Error creating employee:', error);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate("/employees");
        }
    }, [navigate]);

    
    useEffect(() => {
        EmployeeInitData();
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
                        <p>EMPLOYEE CREATE</p>
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
                                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Middle Name</label>
                                <input
                                    type="text"
                                    {...register('middleName')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.middleName && <p className="text-red-500 text-sm">{errors.middleName.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Last Name</label>
                                <input
                                    type="text"
                                    {...register('lastName')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
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
                                {errors.DateofBirth && <p className="text-red-500 text-sm">{errors.DateofBirth.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Date of Joining</label>
                                <input
                                    type="date"
                                    {...register('DateofJoining')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.DateofJoining && <p className="text-red-500 text-sm">{errors.DateofJoining.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Phone Number</label>
                                <input
                                    type="text"
                                    {...register('phoneNumber')}
                                    className="w-full px-3 py-2 border rounded"
                                    maxLength={10}
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
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
                                {errors.Email && <p className="text-red-500 text-sm">{errors.Email.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Designation</label>
                                <select {...register('Designation')} className="w-full px-3 py-2 border rounded">
                                    <option value="" disabled>Select Designation</option>
                                    {designations.map(designation => (
                                        <option key={designation.listItem} value={designation.listItem}>{designation.listItem}</option>
                                    ))}
                                </select>
                                {errors.Designation && <p className="text-red-500 text-sm">{errors.Designation.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Project</label>
                                <select {...register('Project')} className="w-full px-3 py-2 border rounded">
                                    <option value="" disabled>Select Project</option>
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id}>{project.projectName}</option>
                                    ))}
                                </select>
                                {errors.Project && <p className="text-red-500 text-sm">{errors.Project.message}</p>}
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
                                {errors.TeamSelection && <p className="text-red-500 text-sm">{errors.TeamSelection.message}</p>}
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
                                {errors.Manager && <p className="text-red-500 text-sm">{errors.Manager.message}</p>}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="ml-4">Choose Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                            {selectedImage && <img src={selectedImage} alt="Profile Preview" className="w-24 h-24 mt-4" />}
                        </div>
                        <div className="flex justify-center">
                            <button type="submit" className="mr-40 p-2 rounded-md justify-center bg-black hover:bg-white hover:text-black text-white py-2">Create Employee</button>
                            <button type="button" onClick={() => navigate('/employees')} className="p-2 bg-black hover:bg-white hover:text-black text-white py-2 rounded-md">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EmployeeCreate;
