import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { get } from 'react-hook-form';

const AuthContext = createContext();

export class User {
    id = '';
    username = '';
    fullName = '';
    password = '';
    status = false;
    orgUser = false;
    roles = [];
    firstLogin = false;
    orgId = '';
    lastPasswordChangeDate;
}

export class Systempolicy {
    id = '';
    object = '';
    canCreate = false;
    editable = false;
    canView = false;
    roleId = '';
}

export class UserSecurity {
    user = new User();
    policies = new Systempolicy();
}

export class PasswordUpdateData {
    username = '';
    currentPassword = '';
    newPassword = '';
    orgId = '';
}

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')) || null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('token') || '');
    const [userSecurity, setUserSecurity] = useState(new UserSecurity());
    const [user, setUser] = useState(new User());
    const [redirectUrl, setRedirectUrl] = useState('');

    const history = useNavigate();
    const host =process.env.REACT_API_URL;

    const login = async (userName, password) => {
        const urlString = `${host}/oauth/token`;
        const params = new URLSearchParams({
            username: userName,
            password: password,
            grant_type: 'password'
        });
        const headers = {
            Authorization: 'Basic ' + btoa('iamclient:system38567'),
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        try {
            const response = await axios.post(urlString, params.toString(), { headers });
            const user = response.data;
            const token = response.data.access_token;

            setIsLoggedIn(true);
            if (redirectUrl) {
                history(redirectUrl);
                setRedirectUrl('');
            }

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('loggedUser', userName);
                setAccessToken(token);
                localStorage.setItem('token',token);
                setCurrentUser(user);
                console.log(user);
                
            }
            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        setTimeout(() => {
            window.location.reload();
            history('/');
        }, 1000);
        localStorage.removeItem('token');
         localStorage.removeItem('username');
         localStorage.removeItem('orgId');
         localStorage.removeItem('loggedUser');
         localStorage.removeItem('role');
         localStorage.removeItem('currentUser');
         localStorage.removeItem('userDetails');
         localStorage.removeItem('loggedUser');
         setIsLoggedIn(false);
         setCurrentUser(null);
      
       
    };

    const getUserSecurityData = async (username,token) => {
        try {
            const response = await axios.get(`${host}/user/security/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user security data:', error);
            throw error;
        }
    };

    const passwordUpdate = async (data) => {
        try {
            const response = await axios.post(`${host}/user/password/change?access_token=${accessToken}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    };
const getAccessToken= ()=>{
    return accessToken;
}
    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isLoggedIn,
                accessToken,
                userSecurity,
                user,
                setAccessToken,
                setUserSecurity,
                setUser,
                login,
                logout,
                getUserSecurityData,
                passwordUpdate,
                setRedirectUrl,
                setIsLoggedIn,
                setCurrentUser,
                getAccessToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
