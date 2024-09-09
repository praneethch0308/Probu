import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format as formatDate } from "date-fns";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import EmployeeContext from "../../context/employees/EmployeeContext";
import TaskContext from "../../context/tasks/TaskContext";
import ProjectContext from "../../context/projects/ProjectsContext";
import { Note, TaskData } from "../../context/tasks/TaskState";
import ToastNotification from "../../components/ToastNotification";



function TaskUpdate() {
    const location = useLocation();
  const { state: { task, id } } = location;
    const { register, handleSubmit,reset, formState: { errors } } = useForm({
        defaultValues: {
            title: task?.title || "", 
            workEstimate: task?.estimatedWorkTime || "", 
            assignedTo: task?.assignedTo || "", 
            description: task?.description|| "", 
            project: task?.project || [], 
            priority:task?.priority,
            note:task?.comments
         
        },
      });
      const host = "http://157.245.110.240:8080/ProBuServices";
      const orgId= localStorage.getItem('orgId');
      const [toast, setToast] = useState({ message: '', type: '' });
      const username= localStorage.getItem('loggedUser');
      useEffect(() => {
        reset({
            title: task?.title || "", 
            workEstimate: task?.estimatedWorkTime || "", 
            assignedTo: task?.assignedTo || "", 
            description: task?.description|| "", 
            project: task?.project || [], 
            priority:task?.priority,
            note:task?.comments
        })
      }, [task, reset]);

    const navigate = useNavigate();
    const employeeContext = useContext(EmployeeContext);
    const { employees, getEmployees } = employeeContext;
    const taskContext = useContext(TaskContext);
    const { taskInitData, getTaskInitData } = taskContext;
    const priorities = taskInitData?.priorities || [];
    const  statuses= taskInitData?.statuses||[];

    const projectContext = useContext(ProjectContext);
    const { projects, getAllProjects } = projectContext;

    const [filteredEmployees, setFilteredEmployees] = useState({
        createdBy: [],
        assignedBy: [],
        assignedTo: [],
    });

 

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getEmployees();
            getTaskInitData();
            getAllProjects(); // Fetch projects using the context method
        } else {
            navigate("/projects");
        }
    }, []);

    const filterEmployees = (event, type) => {
        const value = event.target.value.toLowerCase();
        const filtered = employees.filter(emp =>
            `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(value)
        );
        setFilteredEmployees(prevState => ({ ...prevState, [type]: filtered }));
    };

    const onSubmit = async (data) => {
        try {
            const taskData = new TaskData();

            // Parse the project value (assuming format is "projectId || projectName")
            const [projectId, projectName] = data.project.split(" || ");

            taskData.task.id =task.id ;
            taskData.task.taskId = task.taskId;
            taskData.task.title = data.title;
            taskData.task.description = data.description || '';
            taskData.task.status = data.status;
            const createdDate = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
            taskData.task.createdDate = createdDate;
            taskData.task.estimatedWorkTime = Number(data.workEstimate);
            taskData.task.completedWork = task.completedWork;
            taskData.task.remainingWork = task.remainingWork;
            taskData.task.createdBy = task.createdBy;
            taskData.task.assignedBy = task.assignedBy;
            taskData.task.assignedTo = data.assignedTo;
            taskData.task.project = projectName;  // Set the project name
            taskData.task.priority = data.priority;
            const completeDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
            taskData.task.completedDate = completeDate;
            taskData.task.assignedEmpObjId = findEmployeeId(data.assignedTo);
            taskData.task.createdEmpObjId = task.createdEmpObjId;
            taskData.task.assignedByEmpObjId = task.assignedByEmpObjId;
            taskData.task.projectObjId = projectId;  // Set the project ID
            taskData.task.mgrObjId = task.mgrObjId;
            taskData.task.orgId = orgId;
            taskData.statuses = [];
            taskData.notes = [];
            taskData.attachments = [];
            taskData.actionTime = createdDate;
            taskData.userName = username;
            taskData.orgId = orgId;

            const accessToken = localStorage.getItem("token");
            console.log(data.status)
            console.log(taskData);
            const response = await axios.post(
                `http://157.245.110.240:8080/ProBuServices/task/update?access_token=${accessToken}`,
                taskData
            );

            console.log(response.data);
            setToast({ message: 'Task updated successfully!', type: 'success' });
            setTimeout(() => {
                navigate("/tasks");
            }, 2000);
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const findEmployeeId = (name) => {
        const employee = filteredEmployees.assignedTo.find(emp =>
            `${emp.firstName} ${emp.lastName}` === name
        );
        return employee ? employee.id : '';
    };

    return (
        <div>
            <div className="pb-10">
                <Mainnav />
            </div>
            <div className="flex justify-between">
                <Sidebar />
                <div className="mr-10 mt-10 items-center w-3/4">
                    <div className="text-center text-4xl w-full bg-gradient-to-r from-black to-neutral-400 py-4 rounded-md">
                        <h1 className="text-white font-semibold">Task Update</h1>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col space-y-4 mt-8 bg-neutral-300 p-5 rounded-md">
                            <div className="flex space-x-4">
                                <div className="w-2/3 flex space-x-4">
                                    <div className="flex flex-col w-1/2">
                                        <label className="text-black pl-1">Task Title</label>
                                        <input className="w-full p-3 rounded-md" {...register('title')} />
                                        {errors.title && (
                                            <p className="text-red-600 text-sm pl-8">{errors.title.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <label className="text-black pl-1">Work Estimation</label>
                                        <input className="w-full p-3 rounded-md" type="number" {...register('workEstimate')} />
                                        {errors.workEstimate && (
                                            <p className="text-red-600 text-sm pl-8">{errors.workEstimate.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="w-1/3 flex flex-col">
                                    <label className="text-black pl-1">Projects</label>
                                    <select {...register('project')} className="w-full px-3 py-2 border rounded">
                                        <option value="" disabled>Select Projects</option>
                                        {projects.map((project) => (
                                            <option key={project.id} value={`${project.id} || ${project.projectName}`}>
                                                {project.projectName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.project && (
                                        <p className="text-red-600 text-sm pl-8">{errors.project.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <div className="flex flex-col">
                                        <label className="text-black pl-1">Assigned To</label>
                                        <input type="text" onChange={(e) => filterEmployees(e, 'assignedTo')} className="w-full px-3 py-2 border rounded" />
                                        <select id="assignedTo" {...register('assignedTo')} className="w-full px-3 py-2 border rounded">
                                            {filteredEmployees.assignedTo.map(employee => (
                                                <option key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
                                                    {employee.firstName} {employee.lastName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.assignedTo && (
                                            <p className="text-red-600 text-sm pl-8">{errors.assignedTo.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <div className="flex flex-col">
                                        <label className="text-black pl-1">Priority</label>
                                        <select {...register('priority')} className="w-full px-3 py-2 border rounded">
                                            {priorities.map(priority => (
                                                <option key={priority.value} value={priority.listItem}>
                                                    {priority.listItem}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.priority && (
                                            <p className="text-red-600 text-sm pl-8">{errors.priority.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <div className="flex flex-col">
                                        <label className="text-black pl-1">Status</label>
                                        <select {...register('status')} className="w-full px-3 py-2 border rounded">
                                            {statuses.map(status => (
                                                <option key={status.value} value={status.listItem}>
                                                    {status.listItem}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.priority && (
                                            <p className="text-red-600 text-sm pl-8">{errors.priority.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black pl-1">Notes</label>
                                <input {...register('note')} className="w-full h-15 p-2 rounded-md" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black pl-1">Task Description</label>
                                <input {...register('description')} className="w-full h-10 p-2 rounded-md" />
                            </div>
                            <div className="flex justify-center">
                                <button type="submit" className="bg-neutral-500 hover:bg-neutral-800 text-white font-bold py-2 px-4 rounded-full">
                                    Create Task
                                </button>
                            </div>
                        </div>
                    </form>
                    <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
                </div>
            </div>
        </div>
    );
}

export default TaskUpdate;
