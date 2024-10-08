import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Mainnav from "../../components/Mainnav";
import Sidebar from "../../components/Sidebar";
import ProjectContext from "../../context/projects/ProjectsContext";
import ClientContext from "../../context/clients/ClientContext";
import EmployeeContext from "../../context/employees/EmployeeContext";
import { useSidebar } from "../../context/sidebar/SidebarContext";
import { ProjectData } from "../../context/projects/ProjectState";
import { format } from 'date-fns';
import axios from "axios";
import ToastNotification from "../../components/ToastNotification";

const ProjectUpdate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: { project } } = location;

  const [toast, setToast] = useState({ message: '', type: '' });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      projName: project?.projectName || "", 
      vertical: project?.vertical || "", 
      projStatus: project?.status || "", 
      description: project?.projectDescription || "", 
      leadCreator: project?.leadCreator || "", 
      clientObjId: project?.clientObjId || "", 
      projManager: project?.projectManager || "", 
      projCost: project?.projCost || 0, 
      gstAmt: project?.gstAmt || 0, 
      startDate: project?.startDate || "", 
      endDate: project?.endDate || "", 
      actualEndDate: project?.actualEndDate || "", 
      allocatedBudget: project?.allocatedBudget || 0, 
      spentBudget: project?.spentBudget || 0, 
      spentBudgetGst: project?.spentBudgetGst || 0
    },
  });
  const host = "http://157.245.110.240:8080/ProBuServices";
  const orgId= localStorage.getItem('orgId');
  const username= localStorage.getItem('loggedUser');
  useEffect(() => {
    reset({
      projName: project?.projectName || "", 
      vertical: project?.vertical || "", 
      projStatus: project?.status || "", 
      description: project?.projectDescription || "", 
      leadCreator: project?.leadCreator || "", 
      clientObjId: project?.clientObjId || "", 
      projManager: project?.projectManager || "", 
      projCost: project?.projCost || 0, 
      gstAmt: project?.gstAmt || 0, 
      startDate: project?.startDate || "", 
      endDate: project?.endDate || "", 
      actualEndDate: project?.actualEndDate || "", 
      allocatedBudget: project?.allocatedBudget || 0, 
      spentBudget: project?.spentBudget || 0, 
      spentBudgetGst: project?.spentBudgetGst || 0
    });
  }, [project, reset]);

  const ProjectForm= new ProjectData();

  const onSubmit = async (data,e) => {
    e.preventDefault();
    try {
        ProjectForm.project.id=project.id;
        ProjectForm.project.projectName=data.projName;
        ProjectForm.project.vertical=data.vertical;
        ProjectForm.project.projectCode=project.projectCode
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
      const response = await axios.post(`${host}/project/update?access_token=${access_token}`,ProjectForm,
        {
          headers: {
            'Content-Type':'application/json',

            
          },
        }
      );
      console.log('Project updated successfully', response.data);
      setToast({ message: 'Project updated successfully!', type: 'success' });
      setTimeout(() => {
          navigate("/projects");
      }, 2000);
    } catch (error) {
      console.error('Error updating project', error.response ? error.response.data : error.message);
    }
  };

  const clientContext = useContext(ClientContext);
  const { clients, getClients } = clientContext;

  const projectContext = useContext(ProjectContext);
  const { ProjectInitData, initData } = projectContext;

  const statuses = initData?.statuses || [];
  const verticals = initData?.verticals || [];

  const employeeContext = useContext(EmployeeContext);
  const { employees, getEmployees } = employeeContext;

  const { isOpened } = useSidebar();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      ProjectInitData();
      getClients();
      getEmployees();
    } else {
      navigate("/projects");
    }
  }, []);

  return (
    <>
      <div className="pb-10">
        <Mainnav />
      </div>
      <div className="flex justify-between">
        <Sidebar />
        <div className={`content-transition mr-8 md:mr-24 mt-10 w-2/3 items-center mb-5`}>
          <div className="bg-gradient-to-r from-black to-neutral-400 p-3 rounded-lg font-bold text-white text-center text-3xl">
            <p>PROJECT UPDATE</p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-neutral-300 p-4 rounded-lg mt-5 w-full"
          >
            <div className="md:flex justify-between">
              <div className="mb-4 md:w-64 rounded-lg">
                <label htmlFor="projName">Project Name</label>
                <input
                  type="text"
                  id="projName"
                  {...register("projName", { required: "Project Name is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.projName ? "border-red-500" : ""}`}
                />
                {errors.projName && <p className="text-red-500">{errors.projName.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label htmlFor="vertical">Vertical</label>
                <select
                  id="vertical"
                  {...register("vertical", { required: "Vertical is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.vertical ? "border-red-500" : ""}`}
                >
                  <option value="" disabled>Select Vertical</option>
                  {verticals.map((vertical) => (
                    <option key={vertical.listItem} value={vertical.listItem}>
                      {vertical.listItem}
                    </option>
                  ))}
                </select>
                {errors.vertical && <p className="text-red-500">{errors.vertical.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label htmlFor="projStatus">Project Status</label>
                <select
                  id="projStatus"
                  {...register("projStatus", { required: "Project Status is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.projStatus ? "border-red-500" : ""}`}
                >
                  <option value="" disabled>Select Project Status</option>
                  {statuses.map((status) => (
                    <option key={status.listItem} value={status.listItem}>
                      {status.listItem}
                    </option>
                  ))}
                </select>
                {errors.projStatus && <p className="text-red-500">{errors.projStatus.message}</p>}
              </div>
            </div>
            <div className="mb-4 rounded-lg">
              <label className="block text-black" htmlFor="description">Description</label>
              <textarea
                id="description"
                {...register("description", { required: "Description is required" })}
                className={`w-full px-3 py-2 border rounded ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>
            <div className="md:flex justify-between">
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black " htmlFor="leadCreator">Lead Creator</label>
                <select
                  id="leadCreator"
                  {...register("leadCreator", { required: "Lead Creator is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.leadCreator ? "border-red-500" : ""}`}
                >
                  <option value="" disabled>Select Lead Creator</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName}
                    </option>
                  ))}
                </select>
                {errors.leadCreator && <p className="text-red-500">{errors.leadCreator.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black " htmlFor="clientObjId">Client</label>
                <select
                  id="clientObjId"
                  {...register("clientObjId", { required: "Client is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.clientObjId ? "border-red-500" : ""}`}
                >
                  <option value="" disabled>Select Client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.clientName}</option>
                  ))}
                </select>
                {errors.clientObjId && <p className="text-red-500">{errors.clientObjId.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black " htmlFor="projManager">Project Manager</label>
                <select
                  id="projManager"
                  {...register("projManager", { required: "Project Manager is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.projManager ? "border-red-500" : ""}`}
                >
                  <option value="" disabled>Select Project Manager</option>
                  {employees.map((employee) => (
                    <option  key={employee.id} value={employee.firstName}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
                {errors.projManager && <p className="text-red-500">{errors.projManager.message}</p>}
              </div>
            </div>
            <div className="md:flex justify-between">
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black" htmlFor="projCost">Project Cost</label>
                <input
                  type="number"
                  id="projCost"
                  {...register("projCost", { required: "Project Cost is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.projCost ? "border-red-500" : ""}`}
                />
                {errors.projCost && <p className="text-red-500">{errors.projCost.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black" htmlFor="gstAmt">GST Amount</label>
                <input
                  type="number"
                  id="gstAmt"
                  {...register("gstAmt", { required: "GST Amount is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.gstAmt ? "border-red-500" : ""}`}
                />
                {errors.gstAmt && <p className="text-red-500">{errors.gstAmt.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black" htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  {...register("startDate", { required: "Start Date is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.startDate ? "border-red-500" : ""}`}
                />
                {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black" htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  {...register("endDate", { required: "End Date is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.endDate ? "border-red-500" : ""}`}
                />
                {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}
              </div>
            </div>
            <div className="md:flex justify-between">
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black" htmlFor="actualEndDate">Actual End Date</label>
                <input
                  type="date"
                  id="actualEndDate"
                  {...register("actualEndDate", { required: "Actual End Date is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.actualEndDate ? "border-red-500" : ""}`}
                />
                {errors.actualEndDate && <p className="text-red-500">{errors.actualEndDate.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black" htmlFor="allocatedBudget">Allocated Budget</label>
                <input
                  type="number"
                  id="allocatedBudget"
                  {...register("allocatedBudget", { required: "Allocated Budget is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.allocatedBudget ? "border-red-500" : ""}`}
                />
                {errors.allocatedBudget && <p className="text-red-500">{errors.allocatedBudget.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black" htmlFor="spentBudget">Spent Budget</label>
                <input
                  type="number"
                  id="spentBudget"
                  {...register("spentBudget", { required: "Spent Budget is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.spentBudget ? "border-red-500" : ""}`}
                />
                {errors.spentBudget && <p className="text-red-500">{errors.spentBudget.message}</p>}
              </div>
              <div className="mb-4 md:w-64 rounded-lg">
                <label className="block text-black" htmlFor="spentBudgetGst">Spent Budget GST</label>
                <input
                  type="number"
                  id="spentBudgetGst"
                  {...register("spentBudgetGst", { required: "Spent Budget GST is required" })}
                  className={`w-full px-3 py-2 border rounded ${errors.spentBudgetGst ? "border-red-500" : ""}`}
                />
                {errors.spentBudgetGst && <p className="text-red-500">{errors.spentBudgetGst.message}</p>}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Update Project
              </button>
            </div>
          </form>
          <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
        </div>
      </div>
    </>
  );
};

export default ProjectUpdate;
