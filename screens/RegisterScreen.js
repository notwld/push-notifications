import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            const response = await fetch('http://192.168.0.133:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "username":username, "email":email, "password":password })
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful, navigate to login screen
                navigation.navigate('LoginScreen');
            } else {
                // Registration failed, display error message
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Register</Text>
            <Text>Fill Below Details to sign up.</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
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
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
            >
                <Text style={styles.btnText}>Register</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                <Text style={{ textAlign: 'center' }}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={{ color: 'blue' }} >Login</Text>
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

export default RegisterScreen;
