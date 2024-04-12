import React, { createContext, useContext } from 'react'
import * as AuthSession from 'expo-auth-session';

// Creates context with initial state
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const signInWithGoogle = async () => {
    }

    return (
        <AuthContext.Provider value={{ user: null }}>
            {children}
        </AuthContext.Provider>
    )
}

export default useAuth = () => {
    return useContext(AuthContext);
}