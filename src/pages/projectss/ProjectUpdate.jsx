import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import 'tailwindcss/tailwind.css';
import Mainnav from '../../components/Mainnav';
import Sidebar from '../../components/Sidebar';
import ClientContext from '../../context/clients/ClientContext';
import { useNavigate } from 'react-router-dom';
import ProjectContext from '../../context/projects/ProjectsContext';


const projectSchema = z.object({
    projName: z.string().min(1, 'Project name is required'),
    vertical: z.string().min(1, 'Vertical is required'),
    projStatus: z.string().min(1, 'Project status is required'),
    description: z.string().min(1, 'Description is required'),
    leadCreator: z.string().min(1, 'Lead creator is required'),
    clientObjId: z.string().min(1, 'Client is required'),
    projManager: z.string().min(1, 'Project manager is required'),
    projCost: z.number().min(0, 'Project cost must be a positive number'),
    allocatedBudget: z.number().min(0, 'Allocated budget must be a positive number'),
    spentBudget: z.number().min(0, 'Spent budget must be a positive number'),
    gstAmt: z.number().min(0, 'GST amount must be a positive number'),
    startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
    actualEndDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
    spentBudgetGst: z.number().optional()
});

const ProjectUpdate = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(projectSchema),
    });


    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();
    const host = "http://157.245.110.240:8080/ProBuServices/project/update";

    const context1 = useContext(ClientContext);
    const { clients, getClients } = context1;
    const context2 = useContext(ProjectContext);
    const { ProjectInitData, initData } = context2;
    const statuses = initData.statuses;
    const verticals = initData.verticals;
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getClients();
        } else {
            navigate("/projects");
        }
    }, [getClients, navigate]);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            ProjectInitData();

        } else {
            navigate("/projects");
        }
    }, [initData, navigate]);




    const onSubmit = async (data) => {
        try {
            const accessToken = localStorage.getItem('token');
            const response = await axios.post(`${host}/ProBuServices/project/create`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log('Project created successfully', response.data);
        } catch (error) {
            console.error('Error creating project', error.response ? error.response.data : error.message);
        }
    };


    return (
        <div>
            <div className="pb-10">
                <Mainnav />
            </div>
            <div className="flex justify-between">
                <Sidebar />
                <div className="mr-8 md:mr-24 mt-10 w-2/3 items-center">
                    <div className="bg-gradient-to-r from-black to-neutral-400 p-3 rounded-lg font-bold text-white text-center text-3xl">
                        <p>PROJECT UPDATE</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-neutral-300 p-4 rounded-lg mt-5 w-full">
                        <div className="md:flex justify-between">
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">Project Name</label>
                                <input
                                    type="text"
                                    {...register('projName')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.projName && <p className="text-red-500 text-sm">{errors.projName.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">Vertical</label>
                                <select {...register('vertical')} className="w-full px-3 py-2 border rounded">
                                    <option value="" selected disabled>Select Vertical</option>
                                    {Array.isArray(verticals) && verticals.map(vertical => (
                                        <option key={vertical.listItem} value={vertical.listItem}>{vertical.listItem}</option>
                                    ))}
                                </select>
                                {errors.vertical && <p className="text-red-500 text-sm">{errors.vertical.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">Project Status</label>
                                <select {...register('projStatus')} className="w-full px-3 py-2 border rounded">
                                    <option value="" selected disabled>Select Project Status</option>
                                    {Array.isArray(statuses) && statuses.map(status => (
                                        <option key={status.listItem} value={status.listItem}>{status.listItem}</option>
                                    ))}
                                </select>
                                {errors.projStatus && <p className="text-red-500 text-sm">{errors.projStatus.message}</p>}
                            </div>
                        </div>
                        <div className="mb-4 rounded-lg">
                            <label className="block text-black">Description</label>
                            <textarea
                                {...register('description')}
                                className="w-full px-3 py-2 border rounded"
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>
                        <div className="md:flex justify-between">
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">Lead Creator</label>
                                <input
                                    type="text"
                                    {...register('leadCreator')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.leadCreator && <p className="text-red-500 text-sm">{errors.leadCreator.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">Client</label>
                                <select {...register('clientObjId')} className="w-full px-3 py-2 border rounded">
                                    <option value="" disabled>Select Client</option>
                                    {clients.map(client => (
                                        <option key={client.clientName} value={client.clientName}>{client.clientName}</option>
                                    ))}
                                </select>
                                {errors.clientObjId && <p className="text-red-500 text-sm">{errors.clientObjId.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">Project Manager</label>
                                <select {...register('projManager')} className="w-full px-3 py-2 border rounded">
                                    <option value="" disabled>Select Project Manager</option>
                                    {employees.map(employee => (
                                        <option key={employee.id} value={employee.id}>{employee.name}</option>
                                    ))}
                                </select>
                                {errors.projManager && <p className="text-red-500 text-sm">{errors.projManager.message}</p>}
                            </div>
                        </div>
                        <div className="md:flex justify-between">
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">Project Cost</label>
                                <input
                                    type="number"
                                    {...register('projCost')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.projCost && <p className="text-red-500 text-sm">{errors.projCost.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">Allocated Budget</label>
                                <input
                                    type="number"
                                    {...register('allocatedBudget')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.allocatedBudget && <p className="text-red-500 text-sm">{errors.allocatedBudget.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">Spent Budget</label>
                                <input
                                    type="number"
                                    {...register('spentBudget')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.spentBudget && <p className="text-red-500 text-sm">{errors.spentBudget.message}</p>}
                            </div>
                        </div>
                        <div className="md:flex justify-between">
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">GST Amount</label>
                                <input
                                    type="number"
                                    {...register('gstAmt')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.gstAmt && <p className="text-red-500 text-sm">{errors.gstAmt.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">Spent Budget GST</label>
                                <input
                                    type="number"
                                    {...register('spentBudgetGst')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.spentBudgetGst && <p className="text-red-500 text-sm">{errors.spentBudgetGst.message}</p>}
                            </div>
                        </div>
                        <div className="md:flex">
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">Start Date</label>
                                <input
                                    type="date"
                                    {...register('startDate')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">End Date</label>
                                <input
                                    type="date"
                                    {...register('endDate')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
                            </div>
                            <div className="mb-4 md:w-64 rounded-lg">
                                <label className="block text-black text-center">Actual End Date</label>
                                <input
                                    type="date"
                                    {...register('actualEndDate')}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.actualEndDate && <p className="text-red-500 text-sm">{errors.actualEndDate.message}</p>}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-black hover:bg-white hover:text-black text-white py-2 rounded">Update Project</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectUpdate