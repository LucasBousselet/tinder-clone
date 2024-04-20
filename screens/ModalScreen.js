import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuth from '../hooks/useAuth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function ModalScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [image, setImage] = useState('');
    const [job, setJob] = useState('');
    const [age, setAge] = useState('');

    const incompleteForm = !image || !job || !age;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Update your profile',
            headerStyle: {
                backgroundColor: '#FF5864',
            },
            headerTitleStyle: {
                color: 'white'
            }
        })
    });

    const updateUserProfile = () => {
        setDoc(doc(db, 'Users', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp()
        }).then(() => {
            navigation.goBack();
        }).catch(error => {
            console.error(error.message);
        })
    }

    return (
        <SafeAreaView className='flex-1'>
            <View className='flex-1 items-center pt-1'>
                <Image
                    className='h-20 w-full'
                    resizeMode='contain'
                    source={{ uri: 'https://1000logos.net/wp-content/uploads/2018/07/Tinder-logo.png' }}
                />
                <Text className='text-xl text-gray-500 p-2 font-bold'>
                    Welcome {user.displayName}
                </Text>

                <Text className='text-center p-4 font-bold text-red-400'>
                    Step 1: The Profile Pic
                </Text>
                <TextInput
                    value={image}
                    onChangeText={setImage}
                    className='text-center text-xl pb-2'
                    placeholder='Enter a Profile Pic URL'
                />

                <Text className='text-center p-4 font-bold text-red-400'>
                    Step 2: The Job
                </Text>
                <TextInput
                    value={job}
                    onChangeText={setJob}
                    className='text-center text-xl pb-2'
                    placeholder='Enter a occupation'
                />

                <Text className='text-center p-4 font-bold text-red-400'>
                    Step 3: The Age
                </Text>
                <TextInput
                    value={age}
                    onChangeText={setAge}
                    className='text-center text-xl pb-2'
                    placeholder='Enter your age'
                    maxLength={2}
                    keyboardType='numeric'
                />

                <TouchableOpacity
                    disabled={incompleteForm}
                    className={'w-64 p-3 rounded-xl absolute bottom-10 ' + (incompleteForm ? 'bg-gray-400' : 'bg-red-400')}
                    onPress={updateUserProfile}
                >
                    <Text className='text-center text-white text-xl'>Update Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}