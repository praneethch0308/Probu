import axios from "axios";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import { z } from 'zod';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TeamSchema = z.object({
    teamName: z.string().min(1, "Team name is required"),
    status: z.string().min(1, "Status is required"),
    // projects: z.array(z.string()).optional(),
    teamLeads: z.string().min(1, "Team lead is required"),
    projectManagers: z.string().min(1, "Project Manager is required")
});

const initialFormData = {
    teamName: "",
    status: "",
    projects: [],
    teamLeads: "",
    projectManagers: ""
};

function TeamCreate() {
    const [formData, setFormData] = useState({ ...initialFormData });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validatedData = TeamSchema.parse(formData);
            const accessToken = localStorage.getItem("token");

            const response = await axios.post(
                "http://your-api-url/team/create",
                validatedData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log(response.data);
            navigate("/teams");
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(
                    error.errors.reduce((acc, curr) => {
                        acc[curr.path[0]] = curr.message;
                        return acc;
                    }, {})
                );
            } else {
                console.error("Error creating team:", error);
            }
        }
    };

    return (
        <div className="">
            <div className="pb-10">
                <Mainnav />
            </div>
            <div className="flex justify-between">
                <div className="">
                    <Sidebar />
                </div>
                <div className="mr-10 mt-10 items-center w-3/4">
                    <div className="text-center text-4xl w-full bg-gradient-to-r from-black to-neutral-400 py-4 rounded-md">
                        <h1 className="text-white font-semibold">Team Create</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col space-y-4 mt-8 bg-neutral-300 p-5 rounded-md">
                            <div className="flex space-x-4">
                                <div className="w-2/3 flex space-x-4">
                                    <div className="flex flex-col w-1/2">
                                        <label className="text-black pl-1">Team Name</label>
                                        <input className="w-full p-3 rounded-md" name="teamName" value={formData.teamName} onChange={handleChange} />
                                        {errors.teamName && (
                                            <p className="text-red-600 text-sm pl-8">{errors.teamName}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <label className="text-black pl-1">Status</label>
                                        <select className="w-full p-3 rounded-md" name="status" value={formData.status} onChange={handleChange}>
                                            <option value="">Select Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-red-600 text-sm pl-8">{errors.status}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="w-1/3 flex flex-col">
                                    <label className="text-black pl-1">Projects</label>
                                    <select className="w-full p-3 rounded-md" name="projects" value={formData.projects} onChange={handleChange} >
                                        {/* Options */}
                                    </select>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <div className="flex flex-col">
                                        <label className="text-black pl-1">Team Leads</label>
                                        <input type="text" className="p-3 rounded-md" name="teamLeads" value={formData.teamLeads} onChange={handleChange} />
                                        {errors.teamLeads && (
                                            <p className="text-red-600 text-sm pl-8">{errors.teamLeads}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="flex flex-col">
                                        <label className="text-black pl-1">Project Managers</label>
                                        <input type="text" className="p-3 rounded-md" name="projectManagers" value={formData.projectManagers} onChange={handleChange} />
                                        {errors.projectManagers && (
                                            <p className="text-red-600 text-sm pl-8">{errors.projectManagers}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-evenly pt-5">
                                <button type="submit" className="bg-black w-36 text-white hover:bg-neutral-700 h-8 rounded-lg">Save</button>
                                <button className="bg-black w-36 text-white hover:bg-neutral-700 h-8 rounded-lg" onClick={() => navigate("/teams")}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TeamCreate;
