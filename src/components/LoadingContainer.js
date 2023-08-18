/* eslint-disable prettier/prettier */
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

function LoadingContainer() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
        position: 'absolute', // Position above other content
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default LoadingContainer;
