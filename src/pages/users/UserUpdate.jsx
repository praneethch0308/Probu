import { useNavigate } from "react-router-dom";

import { z } from 'zod';
import { useState } from "react";
import axios from "axios";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";


const UserSchema = z.object({
    userUsername: z.string(),
    userFullName: z.string().min(1, "Enter your full name")
})


function UserUpdate() {

    const [formData, setformData] = useState({
        userUsername: "",
        userFullName: ""
    })
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validatedData = UserSchema.parse(formData);
            const accessToken = localStorage.getItem("token");

            const response = await axios.post(
                "http://157.245.110.240:8080/ProBuServices/user/update",
                validatedData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log(response.data);
            navigate("/user");
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(
                    error.errors.reduce((acc, curr) => {
                        acc[curr.path[0]] = curr.message;
                        return acc;
                    }, {})
                );
            } else {
                console.error("Error updating user:", error);
            }
        }
    };

    const navigate = useNavigate();
    return (
        <>
            <div className="pb-10">
                <Mainnav />
            </div>
            <div className="flex justify-between">
                <div className="flex">
                    <Sidebar />
                </div>
                <div className="w-2/3 mr-24 mt-10">
                    <div className="text-center text-4xl w-full p-5 bg-gradient-to-r from-black to-neutral-400 py-4 rounded-md">
                        <h1 className="text-white font-semibold">User Update</h1>
                    </div>
                    <div className=" bg-neutral-300 p-5 mt-4">
                        <div className="flex justify-between rounded-md mt-6">
                            <div className="w-1/3 mr-4 ">
                                <input
                                    type="text"
                                    className="p-2 rounded-lg w-64"
                                    placeholder="Username"
                                    name="userUsername"
                                    value={formData.userUsername}
                                    onChange={handleChange}
                                />
                                {errors.clientName && (
                                    <p className="text-red-600 text-sm pl-8">
                                        {errors.clientName}
                                    </p>
                                )}
                            </div>

                            <div className="w-1/3 mr-4">
                                <input
                                    type="text"
                                    className="p-2 rounded-lg w-64"
                                    placeholder="Fullname"
                                    name="userFullName"
                                    value={formData.userFullName}
                                    onChange={handleChange}
                                />
                                {errors.clientName && (
                                    <p className="text-red-600 text-sm pl-8">
                                        {errors.clientName}
                                    </p>
                                )}
                            </div>
                            <div className="w-1/3">
                                <select
                                    type="text"
                                    className="p-2 rounded-lg w-64"
                                    placeholder="Roles" required
                                >
                                    <option disabled selected>Select Role</option>
                                    <option value="admin">ADMIN</option>
                                </select>
                            </div>
                        </div>
                        <label className="flex items-center space-x-2 mt-3">
                            <input type="checkbox" className="form-checkbox" />
                            <span>Org User</span>
                        </label>
                        <div className="flex justify-evenly">
                            <button className="bg-black w-36 text-white hover:bg-neutral-700  h-8 rounded-lg" onClick={handleSubmit}>
                                Save
                            </button>
                            <button className="bg-black w-36 text-white hover:bg-neutral-700  h-8 rounded-lg" onClick={() => { navigate('/user') }}>
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default UserUpdate;