import { View, Text } from 'react-native'
import React from 'react'

export default function SenderMessage({ message }) {
    return (
        <View className='bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2 ml-auto self-start'>
            <Text className='text-white'>{message.message}</Text>
        </View>
    )
}