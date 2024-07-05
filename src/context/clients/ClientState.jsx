import { useEffect, useState } from "react";
import ClientContext from "./ClientContext";
import axios from "axios";

function ClientState(props) {
    const host = "http://157.245.110.240:8080/ProBuServices";
    const Clientsintial = [];

    const [clients, setClients] = useState(Clientsintial);
    const accessToken = localStorage.getItem("token");
    const [initData, setInitData]= useState([]);
    const orgId= localStorage.getItem("orgId")

    const ClientInitData= async()=>{
        try{
          const response = await axios.get(`${baseUrl}/client/init/${orgId}`, {
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

    const CreateOrganization = () => {

    }
    return (
        <ClientContext.Provider value={{ clients, getClients,ClientInitData, initData }}>
            {props.children}
        </ClientContext.Provider>
    );
}

export default ClientState;