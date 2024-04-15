import React, { createContext, useContext, useState } from 'react'
import * as AuthSession from 'expo-auth-session';
import {
    GoogleSignin,
    GoogleSiginButton,
    statusCodes
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    scopes: ['profiles', 'email'],
})

// Creates context with initial state
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    _signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setUser(userInfo);
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        // user cancelled the login flow
                        break;
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // play services not available or outdated
                        break;
                    default:
                    // some other error happened
                }
            } else {
                // an error that's not related to google sign in occurred
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user: user, signIn: _signIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export default useAuth = () => {
    return useContext(AuthContext);
}