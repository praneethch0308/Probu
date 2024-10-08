import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../authentication/AuthContext';
import TeamContext from './TeamsContext';
import { CustListItem, Project } from '../projects/ProjectState';
import { Employee } from '../employees/EmployeeState';



export class Team {
  id = '';
  teamName = '';
  createdDate= Date;
  vertical = '';
  status = '';
  size = 0;
  projectManager = '';
  managerObjId = '';
  teamLead = '';
  leadObjId = '';
  projectNames = [];
  projectObjIds = [];
  orgId = '';
}

export class TeamData {
  team= new Team();
 statuses =[];
  projects= [];
  teamLeads=[];
  projectManagers= [];
  username = '';
  createdate=Date;
}

export const TeamState = ({ children }) => {

  const baseUrl = process.env.REACT_API_URL;
  const [teams, setTeams] = useState([]);
  const [initData,setInitData]= useState([]);
  const orgId = localStorage.getItem('orgId')
  const accessToken = localStorage.getItem('token');
  const getAllTeams = async () => {
    try {

   
      const response = await axios.get(`${baseUrl}/team/all/${orgId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching Teams:', error);
      throw error;
    }
  };

  const TeamInitData= async()=>{
    try{
      const response = await axios.get(`${baseUrl}/team/init/${orgId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
        setInitData(response.data);

    } catch(error){
console.error(error);
    }
  }

  return (
    <TeamContext.Provider value={{ teams, getAllTeams, TeamInitData,initData }}>
      {children}
    </TeamContext.Provider>
  );
};

export default TeamState;