// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import từ file .js

export const useAuth = () => {
    return useContext(AuthContext);
};