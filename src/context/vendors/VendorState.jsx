import { useEffect, useState } from "react";
import axios from "axios";
import VendorContext from "./VendorContext";

export class Vendor {
  id = '';
  vendorName = '';
  companyName = '';
  vendorCode = '';
  vendLogoUrl = '';
  phone = '';
  email = '';
  gstNo = '';
  panNo = '';
  address = '';
  city = '';
  district = '';
  state = '';
  country = '';
  pincode = '';
  type = '';
  status = false;
  projectObjId = [];
  orgId = '';
}

export class ContactInfo {
  id = '';
  contactName = '';
  contactPhone = '';
  contactEmail = '';
  contactDesignation = '';
  isPrimary = false;
  clientObjId = '';
  vendorObjId = '';
  orgObjId = '';
  orgId = '';
}
const VendorState =(props)=>{
    const host="http://157.245.110.240:8080/ProBuServices";
    const Vendorsinitial = [];
    const[vendors,setVendors] = useState(Vendorsinitial);
    const [vendInit, setVenInit]= useState();
    const accessToken = localStorage.getItem("token");
    const orgId= localStorage.getItem('orgId')

    const VendorInitData= async()=>{
      try{
        const response = await axios.get(`${host}/vendor/init/${orgId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,

          }
        });
          setVenInit(response.data);
  
      } catch(error){
  console.error(error);
      }
    }
    const getVendors = async () => {
        try {
      
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
  

      const getCustomUrl = (url) => {
         const accessToken = localStorage.getItem('token');
         return `${host}${url}?access_token=${accessToken}`;
     };
     
     const VendorCreate = async (VendorData) => {
       try {
         const url = getCustomUrl('vendor/create');
         const response = await axios.post(url, VendorData, {
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
           
           console.error('Error creating Vendor:', error.response.data);
         } else {
           console.error('Error creating Vendor:', error);
         }
         throw error;
       }
     };
      return (
        <VendorContext.Provider value={{vendors,getVendors,VendorCreate,vendInit,VendorInitData}}>
            {props.children}
        </VendorContext.Provider>
);

}
export default VendorState
    