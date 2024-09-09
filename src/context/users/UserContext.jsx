import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const baseUrl = "http://157.245.110.240:8080/ProBuServices";
  const [users, setUsers] = useState([]);
  const[userData,setUserData]= useState();

  const getAllUsers = async (pageIndex, pageSize) => {
    try {
      const accessToken = localStorage.getItem("token");
      const orgId = localStorage.getItem("orgId");
      const response = await axios.get(
        `${baseUrl}/user/org_users/${orgId}/${pageIndex}/${pageSize}?access_token=${accessToken}`
      );
      setUsers(response.data.User);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
 const  getUser = async (username)=> {
    const response = await axios.get(
      `${baseUrl}/user/security/${username}?access_token=${accessToken}`
    );
    setUserData(response.data);
  }

  return (
    <UserContext.Provider value={{ users, getAllUsers, getUser, userData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
