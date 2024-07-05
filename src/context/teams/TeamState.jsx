import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../authentication/AuthContext';
import TeamContext from './TeamsContext';


export const TeamState = ({ children }) => {

  const baseUrl = "http://157.245.110.240:8080/ProBuServices";
  const [teams, setTeams] = useState([]);

  const getAllTeams = async () => {
    try {
      const accessToken = localStorage.getItem('token');
      const orgId = localStorage.getItem('orgId')
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

  return (
    <TeamContext.Provider value={{ teams, getAllTeams }}>
      {children}
    </TeamContext.Provider>
  );
};

export default TeamState;