/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Title, Caption, Divider, Button, Text, Card } from 'react-native-paper';
import { AppStyles, AppIcon } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';
import { connect } from 'react-redux';

function ProfileScreen({ user }) {
    const { first_name, last_name, email, online_status, status, user_type } = user;

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content style={{ alignItems: 'center' }}>
                    <Avatar.Image
                        size={150}
                        source={AppIcon.images.defaultUser}
                        style={styles.profileImage}
                    />
                    <Title style={styles.username}>{first_name} {last_name}</Title>
                    <Title style={styles.email}>{email}</Title>
                    <Title style={styles.other}>status : {status}</Title>
                    <Title style={styles.other}>User Type : {user_type}</Title>
                    <Title style={styles.other}>Online Status : {online_status}</Title>
                    <Caption style={styles.bio}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac
                        tristique mauris. Curabitur id elit sed urna condimentum bibendum.
                    </Caption>

                </Card.Content>
            </Card>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        marginBottom: 20,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    email: {
        fontSize: 21,
        fontWeight: '600',
        marginBottom: 5,
    },
    other: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 5,
    },
    bio: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    columnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: {
        width: '90%',
        padding: Configuration.home.listing_item.offset,
        marginTop: 20
    }
});
const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(ProfileScreen);
