import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import 'tailwindcss/tailwind.css';
import Mainnav from '../../components/Mainnav';
import Sidebar from '../../components/Sidebar';
import ClientContext from '../../context/clients/ClientContext';
import { json, useNavigate } from 'react-router-dom';
import ProjectContext from '../../context/projects/ProjectsContext';
import EmployeeContext from '../../context/employees/EmployeeContext';
import { CustListItem, Project, ProjectData } from '../../context/projects/ProjectState';
import { format } from 'date-fns';




const ProjectSchema = z.object({
  projName: z.string().min(1, 'Project Name is required'),
  vertical: z.string().min(1, 'Select Vertical'),
  projStatus: z.string().min(1, 'Select Project Status'),
  description: z.string().min(1, 'Description is required'),
  leadCreator: z.string().min(1, 'Lead Creator is required'),
  clientObjId: z.string().min(1, 'Select Client'),
  projManager: z.string().min(1, 'Select Project Manager'),
  projCost: z.union([z.string().min(1, 'Spent Budget is required'), z.number()]),
  gstAmt:z.union([z.string().min(1, 'Spent Budget is required'), z.number()]),
  startDate: z.string().min(1, 'Start Date is required'),
  endDate: z.string().min(1, 'End Date is required'),
  actualEndDate: z.string().optional(),
  allocatedBudget:z.union([z.string().min(1, 'Spent Budget is required'), z.number()]),
  spentBudget: z.preprocess((val) => val.toString(), z.string().min(1, 'Spent Budget is required')),
  spentBudgetGst: z.union([z.string().min(1, 'Spent Budget is required'), z.number()]),
});

const ProjectCreate = () => {
  const orgId= localStorage.getItem('orgId');
  const username= localStorage.getItem('loggedUser');
  const { register, handleSubmit, formState: { errors } } = useForm({
            resolver: zodResolver(ProjectSchema)
  });

  const navigate = useNavigate();
  const host = "http://157.245.110.240:8080/ProBuServices";

  const clientContext = useContext(ClientContext);
  const { clients, getClients } = clientContext;

  const projectContext = useContext(ProjectContext);
  const { ProjectInitData, initData } = projectContext;


  const employeeContext = useContext(EmployeeContext);
  const { employees, getEmployees } = employeeContext;

  const statuses = initData?.statuses || [];
  const verticals = initData?.verticals || [];


  useEffect(() => {
    if (localStorage.getItem('token')) {
      getClients();
    } else {
      navigate("/projects");
    }
  }, []);


  useEffect(() => {
    if (localStorage.getItem('token')) {
      getEmployees();
    } else {
      navigate("/projects");
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      ProjectInitData();
    } else {
      navigate("/projects");
    }
  }, []);

 const ProjectForm= new ProjectData();

  const onSubmit = async (data,e) => {
    e.preventDefault();
    try {
        ProjectForm.project.projectName=data.projName;
        ProjectForm.project.vertical=data.vertical;
        ProjectForm.project.projectDescription= data.description;
        ProjectForm.project.projectStatus= data.projStatus;
        ProjectForm.project.leadCreator= data.leadCreator;
        ProjectForm.project.clientObjId = data.clientObjId;
        ProjectForm.project.projectManager= data.projManager;
        ProjectForm.project.empObjId= data.projManager;
        ProjectForm.project.projectCost= data.projCost.toString();
        ProjectForm.project.gstAmt= data.gstAmt.toString();
         const stDate= format(new Date(data.startDate), 'yyyy-MM-dd');
        ProjectForm.project.startDate = stDate;
        const endDt =format(new Date(data.endDate), 'yyyy-MM-dd');
          ProjectForm.project.endDate = endDt;
        const actualEndDt = format(new Date(data.actualEndDate), 'yyyy-MM-dd');
          ProjectForm.project.actualEndDate = actualEndDt;
          ProjectForm.project.allocatedBudget = data.allocatedBudget.toString();
          ProjectForm.project.spentBudget = data.spentBudget.toString();
          ProjectForm.project.spentBudgetGst = data.spentBudgetGst.toString();
          ProjectForm.project.leadCreatorObjId = data.leadCreator;
          ProjectForm.project.orgId = orgId;
          const actTime =format(new Date(), 'yyyy-MM-dd');
          ProjectForm.actionTime = actTime;
          ProjectForm.loggedInUsername = username;
          ProjectForm.orgId = orgId;
 console.log(ProjectForm);
      
      const access_token = localStorage.getItem('token');
      if (!access_token) {
        throw new Error('Access token not found');
      }
      console.log('Access Token:', access_token); 
      const response = await axios.post(`${host}/project/create?access_token=${access_token}`,ProjectForm,
        {
          headers: {
            'Content-Type':'application/json',

            
          },
        }
      );
      console.log('Project created successfully', response.data);
      navigate('/projects');
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
            <p>PROJECT CREATE</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-neutral-300 p-4 rounded-lg mt-5 w-full">
            <div className="md:flex justify-between">
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">Project Name</label>
                <input
                  type="text"
                  {...register('projName')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.projName && <p className="text-red-500 text-sm">{errors.projName.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">Vertical</label>
                <select {...register('vertical')} className="w-full px-3 py-2 border rounded">
                  <option value="" disabled>Select Vertical</option>
                  {verticals.map((vertical) => (
                    <option key={vertical.listItem} value={vertical.listItem}>{vertical.listItem}</option>
                  ))}
                </select>
                {errors.vertical && <p className="text-red-500 text-sm">{errors.vertical.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black ">Project Status</label>
                <select {...register('projStatus')} className="w-full px-3 py-2 border rounded">
                  <option value="" disabled>Select Project Status</option>
                  {statuses.map((status) => (
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
                <label className="block text-black ">Lead Creator</label>
              
                <select id="employeeList"  {...register('leadCreator')}
                  className="w-full px-3 py-2 border rounded">
                  {employees.map(employee => (
                    <option key={employee.id} value={`${employee.id}`}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
                {errors.leadCreator && <p className="text-red-500 text-sm">{errors.leadCreator.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black ">Client</label>
                <select {...register('clientObjId')} className="w-full px-3 py-2 border rounded">
                  <option value="" selected disabled>Select Client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.clientName}</option>
                  ))}
                </select>
                {errors.clientObjId && <p className="text-red-500 text-sm">{errors.clientObjId.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black ">Project Manager</label>
                <select {...register('projManager')} className="w-full px-3 py-2 border rounded">
                  <option value="" disabled>Select Project Manager</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={`${employee.id} `}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
                {errors.projManager && <p className="text-red-500 text-sm">{errors.projManager.message}</p>}
              </div>
            </div>
            <div className="md:flex justify-between">
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">Project Cost</label>
                <input  
                  type="text"
                  {...register('projCost', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.projCost && <p className="text-red-500 text-sm">{errors.projCost.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">GST Amount</label>
                <input
                  type="text"
                  {...register('gstAmt', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.gstAmt && <p className="text-red-500 text-sm">{errors.gstAmt.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">Start Date</label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
              </div>
            </div>
            <div className="md:flex justify-between">
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black ">End Date</label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black ">Actual End Date</label>
                <input  
                  type="date"
                  {...register('actualEndDate')}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.actualEndDate && <p className="text-red-500 text-sm">{errors.actualEndDate.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black">Allocated Budget</label>
                <input  
                  type="text"
                  {...register('allocatedBudget', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border rounded" />
                {errors.allocatedBudget && <p className="text-red-500 text-sm">{errors.allocatedBudget.message}</p>}
              </div>
            </div>
            <div className="md:flex">
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black ">Spent Budget</label>
                <input
                  type="text"
                  {...register('spentBudget', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border rounded" />
                {errors.spentBudget && <p className="text-red-500 text-sm">{errors.spentBudget.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg ml-4">
                <label className="block text-black">Spent Budget GST</label>
                <input
                  type="text"
                  {...register('spentBudgetGst', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.spentBudgetGst && <p className="text-red-500 text-sm">{errors.spentBudgetGst.message}</p>}
              </div>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="mr-40 p-2 rounded-md justify-center bg-black hover:bg-neutral-700  text-white py-2">Create Project</button>
              <button type="button" onClick={() => navigate('/projects')} className="p-2 bg-black  text-white hover:bg-neutral-700 py-2 rounded-md">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreate;
