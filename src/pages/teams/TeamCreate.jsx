import axios from "axios";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import { z, ZodArray } from 'zod';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeamData } from "../../context/teams/TeamState";
import EmployeeContext from "../../context/employees/EmployeeContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProjectContext from "../../context/projects/ProjectsContext";
import TeamContext from "../../context/teams/TeamsContext";
import { format } from "date-fns";


const TeamSchema = z.object({
    teamName: z.string().min(1, "Team name is required"),
    status: z.string().min(1, "Status is required"),
    teamLeads: z.string().min(1, "Team lead is required"),
    projectManagers: z.string().min(1, "Project Manager is required"),
    projects:z.string().min(1, "Project is required")
});

function TeamCreate() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(TeamSchema)
    });

    const navigate = useNavigate();
    const employeeContext = useContext(EmployeeContext);
    const { employees, getEmployees } = employeeContext;
    const context = useContext(TeamContext);
    const { TeamInitData, initData } = context;
    const statuses = initData?.statuses || [];
    let projects = initData?.projects || [];

    const [filteredEmployees, setFilteredEmployees] = useState({ teamLeads: [], projManagers: [] });
    const [selectedProjects, setSelectedProjects] = useState();
    const orgId = localStorage.getItem('orgId');
    const username = localStorage.getItem('loggedUser');

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getEmployees();
            TeamInitData();
        } else {
            navigate("/projects");
        }
    }, []);

    const handleProjectChange = (event) => {
        const selected = Array.from(event.target.selectedOptions, option => {
            const [projName, projId] = option.value.split(',');
            return { projName, projId };
        });
        setSelectedProjects(selected);
    };

    const filterEmployees = (event, type) => {
        const value = event.target.value.toLowerCase();
        const filtered = employees.filter(emp =>
            `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(value)
        );
        setFilteredEmployees(prevState => ({ ...prevState, [type]: filtered }));
    };

    const onSubmit = async (data) => {
        try {
            const teamData = new TeamData();
            teamData.team.teamName = data.teamName;
            const createDate = format(new Date(), 'yyyy-MM-dd','en');
            teamData.team.createdDate= createDate;
            teamData.team.status = data.status;
            teamData.team.size = 0;
            teamData.team.projectManager = data.projectManagers;

            const projManager = employees.find(
                emp => `${emp.firstName} ${emp.lastName}` === data.projectManagers
            );
            teamData.team.managerObjId = projManager ? projManager.id : '';

            teamData.team.teamLead = data.teamLeads;
            const teamLead = employees.find(
                emp => `${emp.firstName} ${emp.lastName}` === data.teamLeads
            );
            teamData.team.leadObjId = teamLead ? teamLead.id : '';
            teamData.team.projectNames = [];
            teamData.team.projectObjIds = [];

            selectedProjects.forEach(element => {
                teamData.team.projectNames.push(element.projName);
                teamData.team.projectObjIds.push(element.projId);
            });

            teamData.team.orgId = orgId;
            teamData.username = username;
            teamData.statuses=[];
            teamData.projects=[];
            teamData.teamLeads=[];
            teamData.projectManagers=[];
            
            teamData.createdate = format(new Date(), 'yyyy-MM-dd HH:mm:ss','en');
            console.log(teamData)
            const accessToken = localStorage.getItem("token");
            const response = await axios.post(
                `${process.env.REACT_API_URL}/team/create?access_token=${accessToken}`,
                teamData
               
            );

            console.log(response.data);
            navigate("/teams");
        } catch (error) {
            console.error("Error creating team:", error);
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col space-y-4 mt-8 bg-neutral-300 p-5 rounded-md">
                            <div className="flex space-x-4">
                                <div className="w-2/3 flex space-x-4">
                                    <div className="flex flex-col w-1/2">
                                        <label className="text-black pl-1">Team Name</label>
                                        <input className="w-full p-3 rounded-md" name="teamName" {...register('teamName')} />
                                        {errors.teamName && (
                                            <p className="text-red-600 text-sm pl-8">{errors.teamName.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <label className="text-black pl-1">Status</label>
                                        <select {...register('status')} className="w-full px-3 py-2 border rounded">
                                            <option value="" disabled>Select Team Status</option>
                                            {statuses.map((status, index) => (
                                                <option key={index} value={status.listItem}>{status.listItem}</option>
                                            ))}
                                        </select>
                                        {errors.status && (
                                            <p className="text-red-600 text-sm pl-8">{errors.status.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="w-1/3 flex flex-col">
                                    <label className="text-black pl-1">Projects</label>
                                    <select {...register('projects')} onChange={handleProjectChange} className="w-full px-3 py-2 border rounded">
                                        <option value="" disabled>Select Projects</option>
                                        {projects.map((proj) => (
                                            <option key={proj.id} value={`${proj.projectName},${proj.id}`}>{proj.projectName}</option>
                                        ))}
                                    </select>
                                    {errors.projects && (
                                        <p className="text-red-600 text-sm pl-8">{errors.projects.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <div className="flex flex-col">
                                        <label className="text-black pl-1">Team Leads</label>
                                        <input type="text" onChange={(e) => filterEmployees(e, 'teamLeads')} className="w-full px-3 py-2 border rounded" />
                                        <select id="teamLeads" {...register('teamLeads')} className="w-full px-3 py-2 border rounded">
                                            {filteredEmployees.teamLeads.map((employee) => (
                                                <option key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
                                                    {employee.firstName} {employee.lastName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.teamLeads && <p className="text-red-600 text-sm pl-8">{errors.teamLeads.message}</p>}
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="flex flex-col">
                                        <label className="text-black pl-1">Project Managers</label>
                                        <input type="text" onChange={(e) => filterEmployees(e, 'projManagers')} className="w-full px-3 py-2 border rounded" />
                                        <select id="projectManagers" {...register('projectManagers')} className="w-full px-3 py-2 border rounded">
                                            {filteredEmployees.projManagers.map((employee) => (
                                                <option key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
                                                    {employee.firstName} {employee.lastName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.projectManagers && <p className="text-red-600 text-sm pl-8">{errors.projectManagers.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-evenly pt-5">
                                <button type="submit" className="bg-black w-36 text-white hover:bg-neutral-700 h-8 rounded-lg">Save</button>
                                <button type="button" className="bg-black w-36 text-white hover:bg-neutral-700 h-8 rounded-lg" onClick={() => navigate("/teams")}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TeamCreate;
