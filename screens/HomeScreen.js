import { View, Text, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user, error, signIn, logout } = useAuth();

    return (
        <View>
            <Text>HomeScreen</Text>
            {user && <Button title='Logout' onPress={logout} />}
            <Button title='Go to Chat Screen' onPress={() => navigation.navigate('Chat')} />
        </View>
    )
}