import { View, Text } from 'react-native'
import React from 'react'
import useAuth from '../hooks/useAuth'
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

export default function LoginScreen() {
    const { signIn } = useAuth();

    return (
        <View>
            <Text>Login</Text>
            <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this.signIn}
                disabled={this.state.isSigninInProgress}
            />;
        </View>
    )
}