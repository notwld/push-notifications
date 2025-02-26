import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.0.133:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('user', JSON.stringify(data.user)).then(async () => {
                    await AsyncStorage.getItem("pushToken").then((token) => {
                        if (token) {
                            fetch('http:192.168.0.133:5000/add-expo-token', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ "token": token, "user_id": data.user.id})
                            })
                            .then((response) => response.json()).then((data) => {
                                console.log(data);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            })
                        }
                    }).catch((error) => {
                        console.error('Error:', error);
                    });
                    navigation.navigate('Home');
                });
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Login</Text>
            <Text>Enter your Email and Password to login.</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                <Text style={{ textAlign: 'center' }}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                    <Text style={{ color: 'blue' }} >Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    heading: {
        fontSize: 45,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 7,
        borderRadius: 15,
        marginVertical: 10,
    },
    button: {
        marginTop: 10,
        padding: 15,
        borderRadius: 15,
        backgroundColor: 'black',
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 15,
    }
});

export default LoginScreen;
