import { View, Text, TextInput, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAuth from '../hooks/useAuth'
import getMatchedUserInfo from '../lib/getMatchedUserInfo'
import { useRoute } from '@react-navigation/native'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export default function MessageScreen() {
    const { user } = useAuth();
    const { params } = useRoute();
    const { matchDetails } = params;
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(
            query(
                collection(db, 'Matches', matchDetails.id, 'messages'),
                orderBy('timestamp', 'desc')
            ),
            snapshot => setMessages(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })))
        );

        return unsub;
    }, [matchDetails])

    const sendMessage = () => {
        addDoc(collection(db, 'Matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input
        })
        setInput('');
    }

    return (
        <SafeAreaView className='flex-1'>
            <Header callEnabled title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1'
                keyboardVerticalOffset={10}
            >
                {/* List of messages, closes up the keyboard upon touch */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList
                        inverted
                        data={messages}
                        className='pl-4'
                        keyExtractor={item => item.id}
                        renderItem={({ item: message }) => message.userId === user.uid || message == 1 ? (
                            <SenderMessage key={message.id} message={message} />
                        ) : (
                            <ReceiverMessage key={message.id} message={message} />
                        )}
                    />
                </TouchableWithoutFeedback>

                <View className='flex-row justify-between items-center bg-white border-t border-gray-200 px-5 py-2'>
                    <TextInput
                        className='h-10 text-lg'
                        placeholder='Send Message...'
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        value={input}
                    />
                    <Button
                        title='Send' color='#FF5864' onPress={sendMessage}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}