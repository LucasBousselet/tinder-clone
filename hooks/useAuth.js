import React, { createContext, useContext, useEffect, useState } from 'react'
import {
    GoogleSignin,
    statusCodes
} from '@react-native-google-signin/google-signin';

// Creates context with initial state
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.OAUTH_WEBCLIENT_ID
        });
    }, []);

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setUser(userInfo);
            setError();
        } catch (error) {
            switch (error.code) {
                case statusCodes.SIGN_IN_CANCELLED:
                    // user cancelled the login flow
                    setError(error);
                    break;
                case statusCodes.IN_PROGRESS:
                    // operation (eg. sign in) already in progress
                    setError(error);
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    // play services not available or outdated
                    setError(error);
                    break;
                default:
                    setError(error);
                // some other error happened
            }
        }
    };

    const logout = () => {
        setUser();
        GoogleSignin.revokeAccess();
        GoogleSignin.signOut();
    }

    return (
        <AuthContext.Provider value={{ user, error, signIn, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default useAuth = () => {
    return useContext(AuthContext);
}