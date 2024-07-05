import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ClientContext from '../../context/clients/ClientContext';
import ProjectContext from '../../context/projects/ProjectsContext';
import EmployeeContext from '../../context/employees/EmployeeContext';

const ProjectCreate2 = () => {
  const [formData, setFormData] = useState({
    projName: '', 
    vertical: '',
    description: '',
    projStatus: '',
    leadCreator: '',
    clientObjId: '',
    projManager: '',
    projCost: 0,
    gstAmt: 0,
    startDate: '',
    endDate: '',
    actualEndDate: '',
    allocateBudget: 0,
    spentBudget: 0,
    spentBudgetGst: 0,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const clientContext = useContext(ClientContext);
  const { clients, getClients } = clientContext;

  const projectContext = useContext(ProjectContext);
  const { ProjectInitData, initData } = projectContext;

  const employeeContext = useContext(EmployeeContext);
  const { employees, getEmployees } = employeeContext;

  const statuses = initData?.statuses || [];
  const verticals = initData?.verticals || [];
const accessToken=localStorage.getItem('token');

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getClients();
    } else {
      navigate("/projects");
    }
  }, [getClients, navigate]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getEmployees();
    } else {
      navigate("/projects");
    }
  }, [getEmployees, navigate]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      ProjectInitData();
    } else {
      navigate("/projects");
    }
  }, [ProjectInitData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.projName) errors.projName = 'Project name is required';
    if (!formData.vertical) errors.vertical = 'Vertical is required';
    if (!formData.projStatus) errors.projStatus = 'Project status is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.leadCreator) errors.leadCreator = 'Lead creator is required';
    if (!formData.clientObjId) errors.clientObjId = 'Client is required';
    if (!formData.projManager) errors.projManager = 'Project manager is required';
    if (!formData.projCost) errors.projCost = 'Project cost is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://157.245.110.240:8080/ProBuServices/employee/create",
        formData,
        {
          headers: {
            'Content-Type':'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setFormData({
        projName: '', 
        vertical: '',
        description: '',
        projStatus: '',
        leadCreator: '',
        clientObjId: '',
        projManager: '',
        projCost: 0,
        gstAmt: 0,
        startDate: '',
        endDate: '',
        actualEndDate: '',
        allocateBudget: 0,
        spentBudget: 0,
        spentBudgetGst: 0,
      });



      console.log(response.data);
      navigate("/projects");
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error submitting form');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name:</label>
          <input
            type="text"
            name="projName"
            value={formData.projName}
            onChange={handleChange}
            required
          />
          {errors.projName && <p className="error">{errors.projName}</p>}
        </div>
        <div>
          <label>Vertical</label>
          <select name="vertical" value={formData.vertical} onChange={handleChange}>
            <option value="" disabled>Select Vertical</option>
            {verticals.map((vertical) => (
              <option key={vertical.listItem} value={vertical.listItem}>{vertical.listItem}</option>
            ))}
          </select>
          {errors.vertical && <p className="error">{errors.vertical}</p>}
        </div>
        <div>
          <label>Project Status</label>
          <select name="projStatus" value={formData.projStatus} onChange={handleChange}>
            <option value="" disabled>Select Project Status</option>
            {statuses.map((status) => (
              <option key={status.listItem} value={status.listItem}>{status.listItem}</option>
            ))}
          </select>
          {errors.projStatus && <p className="error">{errors.projStatus}</p>}
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <div>
          <label>Lead Creator</label>
          <input
            type="text"
            name="leadCreator"
            list="employeeList"
            value={formData.leadCreator}
            onChange={handleChange}
          />
          <datalist id="employeeList">
            {employees.map(employee => (
              <option key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </datalist>
          {errors.leadCreator && <p className="error">{errors.leadCreator}</p>}
        </div>
        <div>
          <label>Client</label>
          <select name="clientObjId" value={formData.clientObjId} onChange={handleChange}>
            <option value="" disabled>Select Client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.clientName}</option>
            ))}
          </select>
          {errors.clientObjId && <p className="error">{errors.clientObjId}</p>}
        </div>
        <div>
          <label>Project Manager</label>
          <select name="projManager" value={formData.projManager} onChange={handleChange}>
            <option value="" disabled>Select Project Manager</option>
            {employees.map(employee => (
              <option key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
          {errors.projManager && <p className="error">{errors.projManager}</p>}
        </div>
        <div>
          <label>Project Cost</label>
          <input
            type="number"
            name="projCost"
            value={formData.projCost}
            onChange={handleChange}
          />
          {errors.projCost && <p className="error">{errors.projCost}</p>}
        </div>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          {errors.startDate && <p className="error">{errors.startDate}</p>}
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          {errors.endDate && <p className="error">{errors.endDate}</p>}
        </div>
        <div>
          <label>Actual End Date</label>
          <input
            type="date"
            name="actualEndDate"
            value={formData.actualEndDate}
            onChange={handleChange}
          />
          {errors.actualEndDate && <p className="error">{errors.actualEndDate}</p>}
        </div>
        <div>
          <label>Allocated Budget</label>
          <input
            type="number"
            name="allocateBudget"
            value={formData.allocateBudget}
            onChange={handleChange}
          />
          {errors.allocateBudget && <p className="error">{errors.allocateBudget}</p>}
        </div>
        <div>
          <label>Spent Budget</label>
          <input
            type="number"
            name="spentBudget"
            value={formData.spentBudget}
            onChange={handleChange}
          />
          {errors.spentBudget && <p className="error">{errors.spentBudget}</p>}
        </div>
        <div>
          <label>Spent Budget GST</label>
          <input
            type="number"
            name="spentBudgetGst"
            value={formData.spentBudgetGst}
            onChange={handleChange}
          />
          {errors.spentBudgetGst && <p className="error">{errors.spentBudgetGst}</p>}
        </div>
        <button type="submit">Submit</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ProjectCreate2;
