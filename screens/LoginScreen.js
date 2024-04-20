import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const { user, error, signIn, appLoading, logout } = useAuth();
    const navigation = useNavigation();

    return (
        <View className='flex-1'>
            <ImageBackground
                resizeMode='cover'
                className='flex-1'
                source={{ uri: 'https://tinder.com/static/tinder.png' }}
            >
                <TouchableOpacity
                    onPress={signIn}
                    className='absolute bottom-40 w-52 bg-white p-4 rounded-2xl mx-[25%]'
                >
                    <Text className='font-semibold text-center'>Sign in & get swiping</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}