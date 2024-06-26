import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign, Foundation, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function Header({ title, callEnabled }) {
    const navigation = useNavigation();

    return (
        <View className='p-2 flex-row items-center justify-between'>
            <View className='flex flex-row items-center'>
                <TouchableOpacity className='pl-2' onPress={() => navigation.goBack()}>
                    <Ionicons
                        name='chevron-back-outline'
                        size={34}
                        color='#FF5864'
                    />
                </TouchableOpacity>
                <Text className='text-2xl font-bold pl-2'>{title}</Text>
            </View>

            {callEnabled && (
                <TouchableOpacity className='rounded-full mr-4 px-3 py-2 bg-red-200' onPress={() => navigation.goBack()}>
                    <Foundation
                        name='telephone'
                        size={20}
                        color='red'
                    />
                </TouchableOpacity>
            )}
        </View>
    )
}