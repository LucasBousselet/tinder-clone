import { View, Text, Button, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user, error, appLoading, logout } = useAuth();

    console.log(user);
    return (
        <SafeAreaView>
            {/* Header */}
            <View className='items-center relative flex-row justify-between px-5 pt-3'>
                <TouchableOpacity onPress={logout}>
                    <Image
                        source={{ uri: user.photoURL }}
                        className='h-10 w-10 rounded-full'
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        className='h-12 w-12'
                        source={require('../assets/tinder-logo.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                    <Ionicons
                        name='chatbubbles-sharp'
                        size={30}
                        color='#FF5864'
                    />
                </TouchableOpacity>
            </View>
            <View>
                <Text>HomeScreen</Text>
                {/* {user && <Text>{JSON.stringify(user)}</Text>} */}
                {user && <Button title='Logout' onPress={logout} />}
                <Button title='Go to Chat Screen' onPress={() => navigation.navigate('Chat')} />
            </View>
        </SafeAreaView>
    )
}