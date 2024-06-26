import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth'
import ChatRow from './ChatRow';

export default function ChatList() {
    const [matches, setMatches] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        onSnapshot(query(
            collection(db, 'Matches'),
            where('usersMatched', 'array-contains', user.uid)
        ), snapshot => setMatches(
            snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
        ))
    }, []);

    return (
        matches.length > 0 ? <FlatList
            data={matches}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ChatRow matchDetails={item} />}
            className='h-full'
        /> : (
            <View className='p-5'>
                <Text className='text-center text-lg'>No matches at the moment...</Text>
            </View>
        )
    )
}