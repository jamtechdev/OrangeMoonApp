/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

export default function ProfileScreen() {
    const user = useSelector((state) => state.auth.user);

    return (
        <View>
            <Text>Profile Screen</Text>
            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
        </View>
    );
}
