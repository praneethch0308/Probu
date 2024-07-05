import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import 'tailwindcss/tailwind.css';
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import EmployeeContext from "../../context/employees/EmployeeContext";

const EmployeeSchema = z.object({
    firstName: z.string().min(1, "Firstname is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Lastname is required'),
    DateofBirth: z.date().or(z.string().refine(val => !isNaN(Date.parse(val)), 'enter valid date')),
    DateofJoining: z.date().or(z.string().refine(val => !isNaN(Date.parse(val)), 'enter valid date')),
    phoneNumber: z.string().min(10, "Contact mobile number must be 10 digits").max(10, "Contact mobile number must be 10 digits"),
    Email: z.string().email('enter valid email'),
    Designation: z.string().min(1, 'Select Designation'),
    Project: z.string().min(1, 'Select project'),
    TeamSelection: z.string().min(1, 'Select Team'),
    Manager: z.string().min(1, 'Select manager'),
    IsManager: z.boolean().optional(),
});

const EmployeeCreate = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(EmployeeSchema),
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const context = useContext(EmployeeContext);
    const { EmployeeInitData, initialData } = context;
    const { statuses, designations, projects, teams } = initialData;

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const onSubmit = async (data) => {
        try {
            const accessToken = localStorage.getItem("token");

            const response = await axios.post(
                "http://157.245.110.240:8080/ProBuServices/employee/create",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log(response.data);
            navigate("/employees");
        } catch (error) {
            console.error("Error creating formData:", error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            EmployeeInitData();
        } else {
            navigate("/employees");
        }
    }, [EmployeeInitData, navigate]);

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
                                <label className="block text-black ">Date of Birth</label>
                                <input
                                    type="date"
                                    {...register('DateofBirth')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.DateofBirth && <p className="text-red-500 text-sm">{errors.DateofBirth.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black ">Date of Joining</label>
                                <input
                                    type="date"
                                    {...register('DateofJoining')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.DateofJoining && <p className="text-red-500 text-sm">{errors.DateofJoining.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black ">Phone Number</label>
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
                                <label className="block text-black ">Designation</label>
                                <select {...register('Designation')} className="w-full px-3 py-2 border rounded">
                                    <option value="" disabled>Select Designation</option>
                                    {Array.isArray(designations) && designations.map(designation => (
                                        <option key={designation.listItem} value={designation.listItem}>{designation.listItem}</option>
                                    ))}
                                </select>
                                {errors.Designation && <p className="text-red-500 text-sm">{errors.Designation.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Project</label>
                                <select {...register('Project')} className="w-full px-3 py-2 border rounded">
                                    <option value="" disabled>Select Project</option>
                                    {Array.isArray(projects) && projects.map(project => (
                                        <option key={project.id} value={project.projectName}>{project.projectName}</option>
                                    ))}
                                </select>
                                {errors.Project && <p className="text-red-500 text-sm">{errors.Project.message}</p>}
                            </div>
                        </div>
                        <div className="md:flex justify-start">
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black">Team Selection</label>
                                <select {...register('TeamSelection')} className="w-full px-3 py-2 border rounded">
                                    <option value="" disabled>Team</option>
                                    {Array.isArray(teams) && teams.map(team => (
                                        <option key={team.id} value={team.teamName}>{team.teamName}</option>
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
};

export default EmployeeCreate;
