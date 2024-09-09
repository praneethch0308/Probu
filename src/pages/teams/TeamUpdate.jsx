import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import Select from 'react-select';
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import EmployeeContext from "../../context/employees/EmployeeContext";
import TeamContext from "../../context/teams/TeamsContext";
import ProjectContext from "../../context/projects/ProjectsContext";
import ToastNotification from '../../components/ToastNotification';
import { useLocation, useNavigate } from 'react-router-dom';
import { TeamData } from '../../context/teams/TeamState';

function TeamUpdate() {
    const location = useLocation();
    const navigate= useNavigate();
    const { state: { team, id } } = location;
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            teamName: team?.teamName || "", 
            status: team?.status || "", 
            teamLeads: team?.teamLeads || "", 
            projectManagers: team?.projectManagers || "", 
            projects: team?.projects || [], 
        },
    });
    const orgId = localStorage.getItem('orgId');
    const username = localStorage.getItem('loggedUser');
    const [filteredEmployees, setFilteredEmployees] = useState({ teamLeads: [], projManagers: [] });
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [toast, setToast] = useState({ message: '', type: '' });

    const employeeContext = useContext(EmployeeContext);
    const { employees, getEmployees } = employeeContext;
    const context = useContext(TeamContext);
    const { TeamInitData, initData } = context;
    const statuses = initData?.statuses || [];
    const projects = initData?.projects || [];

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getEmployees();
            TeamInitData();
        } else {
            navigate("/projects");
        }
    }, []);

    useEffect(() => {
        if (employees.length > 0) {
            const teamLeadsOptions = employees.map(emp => ({
                value: `${emp.firstName} ${emp.lastName}`,
                label: `${emp.firstName} ${emp.lastName}`
            }));
            setFilteredEmployees(prevState => ({
                ...prevState,
                teamLeads: teamLeadsOptions,
                projManagers: teamLeadsOptions
            }));
        }
    }, [employees]);

    const handleProjectChange = (event) => {
        const selected = Array.from(event.target.selectedOptions, option => {
            const [projName, projId] = option.value.split(',');
            return { projName, projId };
        });
        setSelectedProjects(selected);
    };

    const onSubmit = async (data) => {
        try {
            const teamData = new TeamData()
            teamData.team.teamName = data.teamName;
            const createDate = format(new Date(), 'yyyy-MM-dd', 'en');
            teamData.team.createdDate = createDate;
            teamData.team.status = data.status;
            teamData.team.size = 0;
            teamData.team.id = team.id;
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

            if (Array.isArray(selectedProjects)) {
                selectedProjects.forEach(element => {
                    teamData.team.projectNames.push(element.projName);
                    teamData.team.projectObjIds.push(element.projId);
                });
            } else {
                console.warn('selectedProjects is not an array', selectedProjects);
            }

            teamData.team.orgId = orgId;
            teamData.username = username;
            teamData.statuses = [];
            teamData.projects = [];
            teamData.teamLeads = [];
            teamData.projectManagers = [];

            teamData.createdate = format(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
            console.log(teamData);
            const accessToken = localStorage.getItem("token");
            const response = await axios.post(
                `http://157.245.110.240:8080/ProBuServices/team/update?access_token=${accessToken}`,
                teamData
            );

            console.log(response.data);
            setToast({ message: 'Team updated successfully!', type: 'success' });
            setTimeout(() => {
                navigate("/teams");
            }, 2000);
        } catch (error) {
            console.error("Error creating team:", error);
            setToast({ message: 'Failed to update team.', type: 'error' });
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
                                        <Controller
                                            name="teamLeads"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    options={filteredEmployees.teamLeads}
                                                    onChange={(option) => onChange(option?.value || '')}
                                                    value={filteredEmployees.teamLeads.find(option => option.value === value) || null}
                                                    isClearable
                                                    placeholder="Select Team Lead"
                                                />
                                            )}
                                        />
                                        {errors.teamLeads && <p className="text-red-600 text-sm pl-8">{errors.teamLeads.message}</p>}
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="flex flex-col">
                                        <label className="text-black pl-1">Project Managers</label>
                                        <Controller
                                            name="projectManagers"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    options={filteredEmployees.projManagers}
                                                    onChange={(option) => onChange(option?.value || '')}
                                                    value={filteredEmployees.projManagers.find(option => option.value === value) || null}
                                                    isClearable
                                                    placeholder="Select Project Manager"
                                                />
                                            )}
                                        />
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
                    <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
                </div>
            </div>
        </div>
    );
}

export default TeamUpdate;
