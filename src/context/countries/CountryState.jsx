import axios from "axios";
import { useEffect, useState } from "react";
import CountryContext from "./CountryContext";


export class CountryList {
    id = 0;
    country = '';
}
export const CountryProvider = ({ children }) => {
    const baseUrl = process.env.REACT_API_URL;
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
 
    const accessToken= localStorage.getItem('token');
const getAllCountries =async ()=>{
    try{
        const response = await axios.get(`${baseUrl}/country/countries`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
              }
        });
          setCountries(response.data);
          console.log(countries);
  
      } catch(error){
  console.error(error);
      }
}

const getAllStates =async (country)=>{
    try{
        const response = await axios.get(`${baseUrl}/country/states/${country}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
              }
        });
        setStates(response.data);
          console.log(states);
  
      } catch(error){
  console.error(error);
      }
}
const getAllDistricts =async (country,state)=>{
    try{
        const response = await axios.get(`${baseUrl}/country/districts/${country}/${state}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
              }
        });
        setDistricts(response.data);
          console.log(districts);
  
      } catch(error){
  console.error(error);
      }
}
useEffect(() => {
    if (localStorage.getItem("token")) {
        getAllCountries();
    }
}, []);


return (
    <CountryContext.Provider value={{ countries, getAllCountries, states, getAllStates, districts, getAllDistricts }}>
      {children}
    </CountryContext.Provider>
  );
}

export default CountryProvider;