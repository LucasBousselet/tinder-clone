import { View, Text, Button, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper'
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const DUMMY_DATA = [{
    firstName: 'Lucas',
    lastName: 'B',
    occupation: 'Senior Software Developer',
    photoURL: 'https://avatars.githubusercontent.com/u/24712956?v=4',
    age: 30
}, {
    firstName: 'Teddy',
    lastName: 'B',
    occupation: 'Graphic Designer',
    photoURL: 'https://avatars.githubusercontent.com/u/24712956?v=4',
    age: 30
}, {
    firstName: 'James',
    lastName: 'S',
    occupation: 'Welder Trade Worker',
    photoURL: 'https://avatars.githubusercontent.com/u/24712956?v=4',
    age: 30
}]

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user, error, appLoading, logout } = useAuth();
    const swiperRef = useRef(null);
    const [profiles, setProfiles] = useState([]);

    useLayoutEffect(() => {
        // If the user viewing the home screen doesn't exist in DB, we force the ModalScreen open
        const unsub = onSnapshot(doc(db, 'Users', user.uid), snapshot => {
            if (!snapshot.exists()) {
                navigation.navigate('Modal');
            }
        });

        return unsub;
    }, []);

    useEffect(() => {
        let unsub;

        const fetchCards = async () => {
            unsub = onSnapshot(collection(db, 'Users'), snapshot => {
                setProfiles(snapshot.docs.filter(doc => doc.id !== user.uid).map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                })));
            });
        }

        fetchCards();

        return unsub;
    }, [])

    const swipeLeft = cardIndex => {
        if (!profiles[cardIndex]) return;
        const userSwiped = profiles[cardIndex];
        console.log('You swiped PASS on ' + userSwiped.displayName);

        setDoc(doc(db, 'Users', user.uid, 'passes', userSwiped.id), userSwiped);
    }

    const swipeRight = async (cardIndex) => {

    }

    console.log(profiles);

    return (
        <SafeAreaView className='flex-1'>
            {/* Header */}
            <View className='items-center relative flex-row justify-between px-5 pt-3'>
                <TouchableOpacity onPress={logout}>
                    <Image
                        source={{ uri: user.photoURL }}
                        className='h-10 w-10 rounded-full'
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
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

            {/* Profile cards deck */}
            <View className='flex-[5] -mt-6'>
                <Swiper
                    ref={swiperRef}
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={(cardIndex) => {
                        console.log('siwipe pass');
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
                        console.log('swipe match');
                        swipeRight(cardIndex);
                    }}
                    overlayLabels={{
                        left: {
                            title: 'NOPE',
                            style: {
                                label: {
                                    textAlign: 'right',
                                    color: 'red'
                                }
                            }
                        },
                        right: {
                            title: 'MATCH',
                            style: {
                                label: {
                                    color: '#4DED30'
                                }
                            }
                        }
                    }}
                    backgroundColor='#4FD0E9'
                    containerStyle={{ backgroundColor: 'transparent' }}
                    cards={profiles}
                    renderCard={card => card ? (
                        <View key={card.displayName} className='bg-white relative h-3/4 rounded-xl'>
                            <Image
                                className='absolute top-0 h-full w-full rounded-xl'
                                source={{ uri: card.photoURL }}
                            />
                            <View className='absolute flex-row bottom-0 justify-between shadow-xl items-center bg-white w-full h-20 px-6 py-2 rounded-b-xl'>
                                <View>
                                    <Text className='text-xl font-bold'>{card.displayName}</Text>
                                    <Text>{card.job}</Text>
                                </View>
                                <Text className='text-2xl font-bold'>{card.age}</Text>
                            </View>
                        </View>
                    ) : (
                        <View className='bg-white relative shadow-xl h-3/4 rounded-xl justify-center items-center'>
                            <Text>No more profiles</Text>
                            <Image
                                className='h-20 w-20'
                                height={100}
                                width={100}
                                source={{ uri: 'https://links.papareact.com/6gb' }}
                            />
                        </View>
                    )}
                />
            </View>

            <View className='flex flex-row justify-evenly flex-1'>
                <TouchableOpacity
                    onPress={() => swiperRef.current.swipeLeft()}
                    className='items-center justify-center rounded-full w-16 h-16 bg-red-200 shadow-lg'
                >
                    <Entypo name='cross' size={24} color='red' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => swiperRef.current.swipeRight()}
                    className='items-center justify-center rounded-full w-16 h-16 bg-green-200 shadow-lg'
                >
                    <Entypo name='heart' size={24} color='green' />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}