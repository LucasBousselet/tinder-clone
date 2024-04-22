import { View, Text, Button, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import Swiper from 'react-native-deck-swiper'
import { collection, doc, getDocs, getDoc, onSnapshot, query, setDoc, where, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { generateId } from '../lib/generateId'

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
            // Fetches the logged-in user doc. Firebase only allows retrieval of the full doc.
            const userDoc = await getDoc(doc(db, 'Users', user.uid));

            let passedUserIds;
            let swipedUserIds;
            // Extracts the users we've swiped left/right so we can filter them out of the suggested profiles.
            if (userDoc.exists()) {
                const passedProfileIds = userDoc.data().passes;
                const swipedProfileIds = userDoc.data().swipes;
                passedUserIds = passedProfileIds?.length > 0 ? passedProfileIds : ['test'];
                swipedUserIds = swipedProfileIds?.length > 0 ? swipedProfileIds : ['test'];
            } else {
                passedUserIds = ['test'];
                swipedUserIds = ['test'];
            }
            // Retrieves all users that we haven't swiped left/right.
            unsub = onSnapshot(query(
                collection(db, 'Users'),
                where('id', 'not-in', [...passedUserIds, ...swipedUserIds])
            ), snapshot => {
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

        // Creates (or updates) a 'passes' property on the user's document, and adds the unwanted profile to it
        updateDoc(doc(db, 'Users', user.uid), {
            passes: arrayUnion(userSwiped.id)
        });
    }

    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]) return;
        const userSwiped = profiles[cardIndex];
        console.log('You swiped MATCH on ' + userSwiped.displayName);

        const userDoc = await getDoc(doc(db, 'Users', user.uid));

        // Creates (or updates) a 'swipes' property on the user's document, and adds the desired profile to it
        updateDoc(doc(db, 'Users', user.uid), {
            swipes: arrayUnion(userSwiped.id)
        });

        // Checks if that profile also swiped on you
        const userSwipedDocLatest = await getDoc(doc(db, 'Users', userSwiped.id));
        if (userDoc.exists() && userSwipedDocLatest.exists()) {
            const { id: swipeeId, swipes: swipeeSwipes, displayName: swipeeName } = userSwipedDocLatest.data();
            const isMatched = swipeeSwipes.includes(userDoc.data().id);

            if (isMatched) {
                console.log("Yay! You matched with " + swipeeName);
                // Creates / updates the Matches collection. Adds the matching pair and their info
                setDoc(doc(db, 'Matches', generateId(user.uid, swipeeId)), {
                    users: {
                        [user.uid]: userDoc.data(),
                        [swipeeId]: userSwipedDocLatest.data()
                    },
                    usersMatched: [user.uid, swipeeId],
                    timestamp: serverTimestamp()
                }).catch(err => console.error(err))
                navigation.navigate('Matched', {
                    loggedInUser: userDoc.data(),
                    userSwiped: userSwipedDocLatest.data()
                });
            }
        }
    }

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