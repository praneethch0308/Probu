import axios from "axios";
import { useEffect, useState } from "react";
import CountryContext from "./CountryContext";


export class CountryList {
    id = 0;
    country = '';
}
export const CountryProvider = ({ children }) => {
    const baseUrl = process.env.REACT_API_URL;
    const [countries, setCountries] = useState(new CountryList());
 
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

useEffect(() => {
    if (localStorage.getItem("token")) {
        getAllCountries();
    }
}, []);


return (
    <CountryContext.Provider value={{ countries, getAllCountries }}>
      {children}
    </CountryContext.Provider>
  );
}

export default CountryProvider;