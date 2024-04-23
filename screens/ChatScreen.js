import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import ChatList from '../components/ChatList'

export default function ChatScreen() {
    return (
        <SafeAreaView className='bg-red-100 flex-1'>
            <Header title='Chat' />
            <ChatList />
        </SafeAreaView>
    )
}