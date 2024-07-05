import { useEffect, useState } from "react";
import axios from "axios";
import VendorContext from "./VendorContext";

const VendorState =(props)=>{
    const host="http://157.245.110.240:8080/ProBuServices";
    const Vendorsinitial = [];
    const[vendors,setVendors] = useState(Vendorsinitial);
    const getVendors = async () => {
        try {
          const accessToken = localStorage.getItem("token");
          const orgId= localStorage.getItem('orgId')
          const response = await axios.get(`${host}/vendor/all/org/${orgId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setVendors(response.data);
        } catch (error) {
          console.error("Error fetching Vendors data:", error);
        }
      };
      useEffect(() => {
        if (localStorage.getItem("token")) {
          getVendors();
        }
      }, []); 
      const CreateVendor=()=>{
        
      }
      return (
        <VendorContext.Provider value={{vendors,getVendors}}>
            {props.children}
        </VendorContext.Provider>
);

}
export default VendorState
    