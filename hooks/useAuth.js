import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
    GoogleSignin,
    statusCodes
} from '@react-native-google-signin/google-signin';
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut
} from 'firebase/auth'
import { auth } from '../firebase';

// Creates context with initial state
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [appLoading, setAppLoading] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.OAUTH_WEBCLIENT_ID
        });

        // The following observer fires off everytime a change of state is happening for the current user (logged-in / out usually)
        const unsub = onAuthStateChanged(auth, (user) => {
            console.log('here')
            console.log(!!user);
            if (user) {
                // user just logged in
                setUser(user);
            } else {
                // logged out
                setUser(null);
            }
            setAuthLoading(false)
        });
        return unsub;
    }, []);

    const signIn = async () => {
        try {
            setAppLoading(true);
            /**
             * On Android, we need to make sure Play Services has been enabled.
             * On iOS, the next line returns immediately.
             */
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            // setUser(userInfo);
            setError();
            const credential = GoogleAuthProvider.credential(userInfo.idToken);

            /**
             * See docs linked in firebase.js, we are handling the sign-in workflow manually. Meaning we aren't using Firebase SDK itself to
             * sign-in through Google, but instead we are implementing Google sign-in with its own library (react-native-google-signin), and then
             * handing off the idToken to Firebase as credentials.
             */
            signInWithCredential(auth, credential).catch(function (error) {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The credential that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
        } catch (error) {
            console.error(error);
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
        } finally {
            setAppLoading(false);
        }
    };

    const logout = () => {
        setUser();
        setAppLoading(true);
        GoogleSignin.revokeAccess();
        GoogleSignin.signOut();
        signOut(auth)
            .catch(err => setError(err))
            .finally(() => setAppLoading(false));
    }

    const authContextData = useMemo(() => ({
        user,
        error,
        appLoading,
        signIn,
        logout
    }), [user, error, appLoading]);

    return (
        <AuthContext.Provider value={authContextData}>
            {!authLoading && children}
        </AuthContext.Provider>
    )
}

export default useAuth = () => {
    return useContext(AuthContext);
}