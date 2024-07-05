import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeContext from "./EmployeeContext";
import { useAuth } from "../authentication/AuthContext";

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
            Authorization: `Bearer ${accessToken}`
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
      useEffect(() => {
        if (localStorage.getItem("orgId")) {
          getEmployees();
        }
      }, []); 
      const CreateEmployee=()=>{
        
      }
      return (
        <EmployeeContext.Provider value={{employees,getEmployees,initialData,EmployeeInitData }}>
            {props.children}
        </EmployeeContext.Provider>
);

}
export default EmployeeState
    