import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Loader = ({ navigation }) => {
    useEffect(() => {
        (async () => {
            await AsyncStorage.getItem('user').then((data) => {
                if (data) {
                    navigation.navigate('Home');
                } else {
                    navigation.navigate('LoginScreen');
                }
            }).catch((error) => {
                console.error('Error:', error);
            })
        })();
    }, []);
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="black" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Loader;