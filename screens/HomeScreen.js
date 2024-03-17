import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const [user, setUser] = useState({ username: 'Guest' });
    const [expoPushToken, setExpoPushToken] = useState('');


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await AsyncStorage.getItem('user');
                if (data) {
                    setUser(JSON.parse(data));
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUser();
    }, []);

    const handleSendNotification = async () => {
        await AsyncStorage.getItem('pushToken').then((data) => {
            if (data) {
                setExpoPushToken(data);
                fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Accept-encoding': 'gzip, deflate',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: expoPushToken,
                        sound: 'default',
                        title: `Hello ${user.username}!`,
                        body: 'This is a test notification',
                        data: { someData: 'goes here' },
                    }),
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    }
                    )

            }
        })
    }

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('pushToken');
            navigation.navigate('LoginScreen');
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Welcome {user.username}</Text>
            <Text>You will be able to receive push notifications here.</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleSendNotification()}>
                <Text>Send Push Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleLogout()}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 20
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 5
    },
    button: {
        backgroundColor: 'lightblue',
        padding: 10,
        marginTop: 20,
        borderRadius: 5
    }
});

export default HomeScreen;
