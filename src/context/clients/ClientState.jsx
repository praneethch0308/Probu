import { useEffect, useState } from "react";
import ClientContext from "./ClientContext";
import axios from "axios";


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
function ClientState(props) {
    const host =process.env.REACT_API_URL;
    const Clientsintial = [];

    const [clients, setClients] = useState(Clientsintial);
    const [clientObj, setClientObj] = useState();
    const accessToken = localStorage.getItem("token");
    const [initData, setInitData]= useState([]);
    const orgId= localStorage.getItem("orgId")

    const ClientInitData= async()=>{
        try{
          const response = await axios.get(`${host}/client/init/${orgId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
            setInitData(response.data);
    
        } catch(error){
    console.error(error);
        }
      }

    const getClients = async () => {
        try {
 
            const response = await axios.get(`${host}/client/all/org/${orgId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setClients(response.data);
        } catch (error) {
            console.error("Error fetching clients data:", error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getClients();
        }
    }, []);

    const GetClientbyCode = async (code,orgId) => {
        try{
            const response = await axios.get(`${host}/client/${code}/${orgId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
              setClientObj(response.data);
              console.log(clientObj);
              console.log(code);
              console.log(orgId);
      
          } catch(error){
      console.error(error);
          }
    }
    return (
        <ClientContext.Provider value={{ clients, getClients,ClientInitData, initData, clientObj, GetClientbyCode }}>
            {props.children}
        </ClientContext.Provider>
    );
}

export default ClientState;