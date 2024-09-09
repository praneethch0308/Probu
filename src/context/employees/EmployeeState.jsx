import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeContext from "./EmployeeContext";
import { useAuth } from "../authentication/AuthContext";
import { any } from "zod";


export class Employee {
  id = '';
  firstName = '';
  middleName = '';
  lastName = '';
  empId = '';
  empImageUrl = '';
  dob=Date;
  doj=Date;
  phoneNumber = '';
  email = '';
  designation = '';
  status = '';
  manager = false;
  managerObjId = '';
  managerName = '';
  hourlyRate= 0;
  teams = [];
  orgId = '';
  projects = [];
  userObjId = '';
}

export class EmployeeUpdatedata {  
          emp = new Employee();
          username="";
          orgId="";
  
  }
const EmployeeState =(props)=>{
    const host="http://157.245.110.240:8080/ProBuServices";
   
    const[employees,setEmployees] = useState([]);
    const [initialData,setInitialData]=useState([]);
    const accessToken = localStorage.getItem("token");
    const orgId = localStorage.getItem("orgId")

    const EmployeeInitData= async()=>{
      try{
        const response = await axios.get(`${host}/employee/init/${orgId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,

          }
        });
          setInitialData(response.data);
  
      } catch(error){
  console.error(error);
      }
    }
    const getEmployees = async () => {
        try {
  
          const response = await axios.get(`${host}/employee/all/orgs/${orgId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,

            },
          });
          setEmployees(response.data);
        } catch (error) {
          console.error("Error fetching employees data:", error);
        }
      };
      // useEffect(() => {
      //   if (localStorage.getItem("orgId")) {
      //     getEmployees();
      //   }
      // }, [employees]); 
      const baseUrl = 'http://157.245.110.240:8080/ProBuServices/';

       const getCustomUrl = (url) => {
          const accessToken = localStorage.getItem('token');
          return `${baseUrl}${url}?access_token=${accessToken}`;
      };
      
      const empCreate = async (empData) => {
        try {
          const url = getCustomUrl('employee/create');
          const response = await axios.post(url, empData, {
            headers: {
              'Content-Type':'multi-part/form-data'
            },
      
          });
          console.log('Response Headers:', response.headers);

          if (response.headers.connection === 'close') {
            console.log('Connection: close header is set');
          }
    
          return response.data;
        
        } catch (error) {
          if (error.response) {
            
            console.error('Error creating employee:', error.response.data);
          } else {
            console.error('Error creating employee:', error);
          }
          throw error;
        }
      };

      // const empUpdate = async (empData) => {
      //   try {
      //     const url = getCustomUrl('employee/update');
      //     const response = await axios.post(url, empData, {
         
      
      //     });
      //     console.log('Response Headers:', response.headers);

      //     if (response.headers.connection === 'close') {
      //       console.log('Connection: close header is set');
      //     }
    
      //     return response.data;
        
      //   } catch (error) {
      //     if (error.response) {
            
      //       console.error('Error creating employee:', error.response.data);
      //     } else {
      //       console.error('Error creating employee:', error);
      //     }
      //     throw error;
      //   }
      // };
      return (
        <EmployeeContext.Provider value={{employees,getEmployees,initialData,EmployeeInitData,empCreate }}>
            {props.children}
        </EmployeeContext.Provider>
);

}
export default EmployeeState
    