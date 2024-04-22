import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function MatchedScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { loggedInUser, userSwiped } = route.params;

    return (
        <View className='h-full bg-red-500 pt-20 opacity-90'>
            <View className='justify-center px-10 pt-20'>
                <Image
                    source={{ uri: 'http://links.papareact.com/mg9' }}
                    className='h-20 w-full'
                />
            </View>

            <Text className='text-white text-center font-semibold my-5'>You and {userSwiped.displayName} have matched each other!</Text>

            <View className='flex-row justify-evenly'>
                <Image
                    className='h-32 w-32 rounded-full'
                    source={{ uri: loggedInUser.photoURL }}
                />
                <Image
                    className='h-32 w-32 rounded-full'
                    source={{ uri: userSwiped.photoURL }}
                />
            </View>
            <TouchableOpacity
                className='bg-white m-5 px-10 py-8 rounded-full mt-20'
                onPress={() => {
                    navigation.goBack();
                    navigation.navigate('Chat');
                }}
            >
                <Text className='text-center font-semibold'>Send a Message</Text>
            </TouchableOpacity>
        </View>
    )
}