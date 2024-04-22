import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import useAuth from '../hooks/useAuth'
import ModalScreen from '../screens/ModalScreen';
import MatchedScreen from '../screens/MatchedScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    const { user } = useAuth();

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            {/* Screen at the top is rendered as landing screen */}
            {user ? (
                <>
                    <Stack.Group>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Chat" component={ChatScreen} />
                    </Stack.Group>
                    <Stack.Group>
                        <Stack.Screen
                            name="Modal"
                            component={ModalScreen}
                            screenOptions={{
                                presentation: 'modal'
                            }} />
                    </Stack.Group>
                    <Stack.Group>
                        <Stack.Screen
                            name="Matched"
                            component={MatchedScreen}
                            screenOptions={{
                                presentation: 'transparentModal'
                            }} />
                    </Stack.Group>
                </>
            ) : (
                <Stack.Screen name="Login" component={LoginScreen} />
            )}
        </Stack.Navigator>
    )
}