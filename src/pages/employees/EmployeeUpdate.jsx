import { useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import { useState } from "react";
import { FaSearch } from 'react-icons/fa';
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";

const EmployeeSchema = z.object({
    firstName: z.string().min(1, "Firstname is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Lastname is required'),
    DateofBirth: z.date('enter valid date'),
    DateofJoining: z.date('enter valid date'),
    phoneNumber: z.string()
        .min(10, "*Contact mobile number must be 10 digits")
        .max(10, "*Contact mobile number must be 10 digits"),
    Email: z.string().email('enter valid email'),
    Designation: z.string().min(1, 'Select Designation'),
    Project: z.string().min(1, 'select project'),
    TeamSelection: z.string().min(1, 'Select Team'),
    Manager: z.string().min(1, 'select manager')
})
const EmployeeUpdate = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        DateofBirth: '',
        DateofJoining: '',
        phoneNumber: '',
        Email: '',
        Designation: '',
        Project: '',
        TeamSelection: '',
        Manager: '',
    })
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        const { name, value } = e.target;
        const phoneNumberPattern = /^\d{0,10}$/;

        if (name === 'phoneNumber') {
            if (phoneNumberPattern.test(value)) {
                setFormData({
                    ...formData,
                    [name]: value
                });

                // Clear any previous error message
                setErrors({
                    ...errors,
                    [name]: ''
                });
            } else {
                setErrors({
                    ...errors,
                    [name]: 'Phone number must be 10 digits'
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const validatedData = EmployeeSchema.parse(formData);
            const accessToken = localStorage.getItem("token");

            const response = await axios.post(
                "http://157.245.110.240:8080/ProBuServices/employee/update",
                validatedData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log(response.data);
            navigate("/employees");
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(
                    error.errors.reduce((acc, curr) => {
                        acc[curr.path[0]] = curr.message;
                        return acc;
                    }, {})
                );
            } else {
                console.error("Error creating formData:", error);
            }
        }
    }
    return (
        <div>
            <div className="pb-10">
                <Mainnav />
            </div>
            <div className="flex justify-between">
                <div className="">
                    <Sidebar />
                </div>
                <div className="mr-24 w-2/3 items-center">
                    <div className="bg-gradient-to-r from-neutral-700 to-neutral-400 p-4 rounded-lg mt-10 w-full">
                        <p className="text-center text-white stroke-black text-2xl font-bold">
                            Employee-Update
                        </p>
                    </div>
                    <form className=" rounded-lg p-5 mt-4 bg-neutral-200" onSubmit={handleSubmit}>
                        <div className="flex justify-between pt-5">
                            <div>

                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="p-2 rounded border border-black ml-2 justify-center"
                                    placeholder="Enter the First Name "
                                />
                                {errors.firstName && (
                                    <p className="text-red-600 text-sm pl-1">{errors.firstName}</p>
                                )}
                            </div>
                            <div>

                                <input
                                    type="text"
                                    name="middlename"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    className="p-2 rounded border border-black ml-2"
                                    placeholder="Enter the Middle Name"
                                />
                                {errors.middleName && (
                                    <p className="text-red-600 text-sm pl-1">{errors.middleName}</p>
                                )}
                            </div>
                            <div>

                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="p-2 rounded border border-black ml-2 "
                                    placeholder="Enter the Last Name"
                                />
                                {errors.lastName && (
                                    <p className="text-red-600 text-sm pl-1">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between pt-5">
                            <div>

                                <input
                                    type="date"
                                    name="DateofBirth"
                                    value={formData.DateofBirth}
                                    onChange={handleChange}
                                    className="p-2 rounded border border-black ml-2"
                                    placeholder="Date of Birth"
                                />
                                {errors.DateofBirth && (
                                    <p className="text-red-600 text-sm pl-1">{errors.DateofBirth}</p>
                                )}
                            </div>
                            <div>

                                <input
                                    type="date"
                                    name="DateofJoining"
                                    value={formData.DateofJoining}
                                    onChange={handleChange}
                                    className="p-2 rounded border border-black ml-2"
                                    placeholder="Date of Joining"
                                />
                                {errors.DateofJoining && (
                                    <p className="text-red-600 text-sm pl-1">{errors.DateofJoining}</p>
                                )}
                            </div>
                            <div>

                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="p-2 rounded border border-black ml-2"
                                    placeholder="Phone Number"
                                    maxLength={10}
                                    pattern="\d*"
                                />
                                {errors.phoneNumber && (
                                    <p className="text-red-600 text-sm pl-1">{errors.phoneNumber}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between pt-5">
                            <div>

                                <input
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    className="p-2 rounded border border-black ml-2"
                                    placeholder="Email ID"
                                />
                                {errors.Email && (
                                    <p className="text-red-600 text-sm pl-1">
                                        {errors.Email}
                                    </p>
                                )}
                            </div>
                            <div>

                                <select
                                    name="Designation"
                                    value={formData.Designation}
                                    onChange={handleChange}
                                    className="p-2 px-9 rounded border border-black mr"
                                >
                                    <option value="" disabled>
                                        Designation
                                    </option>
                                    <option value="Manager">Manager</option>
                                    <option value="Salesmanager">Salesmanager</option>
                                    <option value="Employee">Employee</option>
                                </select>
                                {errors.Designation && (
                                    <p className="text-red-600 text-sm pl-1">
                                        {errors.Designation}
                                    </p>
                                )}
                            </div>
                            <div>

                                <select
                                    name="Project"
                                    value={formData.Project}
                                    onChange={handleChange}
                                    className="p-2 px-7 rounded border border-black mr"
                                >
                                    <option value="" disabled>
                                        Project
                                    </option>
                                    <option value="Nike">Nike</option>
                                    <option value="Weatherforecast">Weatherforecast</option>
                                    <option value="Movieland">Movieland</option>
                                </select>
                                {errors.Project && (
                                    <p className="text-red-600 text-sm pl-1">
                                        {errors.Project}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between pt-5 ">
                            <div>
                                <select
                                    name="TeamSelection"
                                    value={formData.TeamSelection}
                                    onChange={handleChange}
                                    className="p-2 px-9 rounded border border-black ml-2 "
                                >
                                    <option value="" disabled>
                                        Team Selection
                                    </option>
                                    <option value="jntuk">jntuk</option>
                                    <option value="jntuh">jntuh</option>
                                </select>
                                {errors.TeamSelection && (
                                    <p className="text-red-600 text-sm pl-1">
                                        {errors.TeamSelection}
                                    </p>
                                )}
                            </div>
                            <div >

                                <input
                                    type="text"
                                    name="Manager"
                                    value={formData.Manager}
                                    onChange={handleChange}
                                    className="p-2  rounded border border-black mr-44"
                                    placeholder=""
                                />
                                {errors.Manager && (
                                    <p className="text-red-600 text-sm pl-1">
                                        {errors.Manager}
                                    </p>
                                )}
                            </div>
                            <div>
                                <FaSearch className=' flex h-8 w-5  ' />
                            </div>

                        </div>
                        <div className="flex justify-center p-4">
                            <div>
                                <input type="checkbox" />
                                <label>Is Manager</label>
                            </div>
                            <div className="pt-4 ml-10">
                                <label htmlFor="logoInput" className="bg-black p-2 hover:bg-white text-white hover:text-black w-36 h-8 rounded-lg cursor-pointer">
                                    Choose Image
                                </label>
                                <input
                                    id="logoInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <div className="flex justify-evenly mt-3">
                            <button
                                className="bg-black hover:bg-white hover:text-black text-white w-36 h-8 rounded-lg"
                                type="submit" onClick={handleSubmit}
                            >
                                Update
                            </button>
                            <button
                                className="bg-black hover:bg-white hover:text-black text-white w-36 h-8 rounded-lg"
                                onClick={() => navigate("/tasks")}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default EmployeeUpdate