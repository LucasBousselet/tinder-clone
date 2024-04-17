import { View, Text, Button } from 'react-native'
import React from 'react'
import useAuth from '../hooks/useAuth'
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

export default function LoginScreen() {
    const { user, error, signIn, logout } = useAuth();

    return (
        <View>
            <Text>Login v3</Text>
            <Text>{JSON.stringify(error)}</Text>
            {!user && (
                <GoogleSigninButton
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={signIn}
                // disabled={this.state.isSigninInProgress}
                />
            )}
        </View>
    )
}