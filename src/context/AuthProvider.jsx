// src/context/AuthProvider.jsx
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as loginService } from '../api/authService';
import { setAuthHeader, clearAuthHeader } from '../api/axiosConfig';
import { AuthContext } from './AuthContext'; // Import từ file vừa tạo

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                if (decodedUser.exp * 1000 > Date.now()) {
                    setUser({
                        id: decodedUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                        username: decodedUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                        roles: Array.isArray(decodedUser['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
                            ? decodedUser['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                            : [decodedUser['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']],
                    });
                    setAuthHeader(token);
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = async (usernameOrEmail, password) => {
        try {
            const response = await loginService(usernameOrEmail, password);
            const { accessToken } = response.data.data; // << Chú ý: response của bạn có nested 'data'
            localStorage.setItem('token', accessToken);
            
            const decodedUser = jwtDecode(accessToken);
             setUser({
                id: decodedUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                username: decodedUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                roles: Array.isArray(decodedUser['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
                    ? decodedUser['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                    : [decodedUser['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']],
            });
            setAuthHeader(accessToken);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        clearAuthHeader();
    };

    const value = { user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};