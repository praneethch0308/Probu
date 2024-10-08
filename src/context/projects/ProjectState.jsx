import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import ProjectContext from './ProjectsContext';

export class Project {
  id = '';
  projectName = '';
  vertical = '';
  projectCode = '';
  projectDescription = '';
  projectStatus = '';
  leadCreator = '';
  clientObjId = '';
  projectManager = '';
  empObjId = '';
  projectCost = 0;
  gstAmt = 0;
  startDate;
  endDate;
  actualEndDate;
  allocatedBudget = 0;
  spentBudget = 0;
  spentBudgetGst = 0;
  paymentReceivedStatus = '';
  leadCreatorObjId = '';
  orgId = '';
}


export class CustListItem {
  id = '';
  listName = '';
  listItem = '';
  status = '';
  orgId = '';
}

export class ProjectData {
  project = new Project;
  statuses =[];
  verticals = [];
  actionTime = Date;
  loggedInUsername= '';
  orgId= '';
}
export const ProjectProvider = ({ children }) => {

  const baseUrl = process.env.REACT_API_URL;
  const [projects, setProjects] = useState([]);
  const [initData,setInitData]= useState([]);
  const accessToken = localStorage.getItem('token');
  const orgId = localStorage.getItem('orgId')

  const ProjectInitData= async()=>{
    try{
      const response = await axios.get(`${baseUrl}/project/init/${orgId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
        setInitData(response.data);

    } catch(error){
console.error(error);
    }
  }

  const getAllProjects = async () => {
    try {
      
      const response = await axios.get(`${baseUrl}/project/all/org/${orgId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setProjects(response.data);
    } catch (error) {

      console.error('Error fetching projects:', error);
      throw error;
    }
  };




  useEffect(() => {
    if (localStorage.getItem("token")) {
        getAllProjects();
    }
}, []);


  return (
    <ProjectContext.Provider value={{ projects, getAllProjects,ProjectInitData, initData }}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
