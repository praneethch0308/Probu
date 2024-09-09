import { useEffect, useState } from "react";
import OrganizationContext from "./OrganizationContext";
import axios from "axios";


const OrganizationState=(props)=>{
    const host="http://157.245.110.240:8080/ProBuServices";
    const Organizationsintial=[];

    const [organizations,setOrganizations]=useState(Organizationsintial);

    const getOrganizations = async () => {
        try {
          const accessToken = localStorage.getItem("token");
          const response = await axios.get(`${host}/org/all`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setOrganizations(response.data);
        } catch (error) {
          console.error("Error fetching organizations data:", error);
        }
      };
    
   

      const CreateOrganization=()=>{
        
      }
    return (
            <OrganizationContext.Provider value={{organizations,getOrganizations}}>
                {props.children}
            </OrganizationContext.Provider>
    );

}
export default OrganizationState