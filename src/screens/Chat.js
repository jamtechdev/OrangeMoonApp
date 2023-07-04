/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { AppIcon, AppStyles } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';
import { GiftedChat } from 'react-native-gifted-chat';


function ChatScreen({ navigation, user }) {
    const [messages, setMessages] = useState([])
    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         title: 'Chat',
    //     });
    // }, [navigation]);


    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hello OrangeMoon user',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'orangeMoon',
                    avatar: AppIcon.images.logo,
                },
            },
        ])
    }, [])

    const handleSend = (newMessages) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, newMessages)
        );
    };

    const route = () => {
        navigation.navigate('LoginStack');
    };

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={handleSend}
                user={{
                    _id: 1,
                    name: 'user',
                    avatar: AppIcon.images.defaultUser,
                }}
                renderUsernameOnMessage={true}
                showUserAvatar={true}
                // isTyping={true}
                scrollToBottom={true}
                alwaysShowSend={true}
                // alignTop={true}
                // infiniteScroll={true}
                placeholder="Type a message..."
                timeTextStyle={{ left: { color: 'red' }, right: { color: 'green' } }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
    },
});

// const mapStateToProps = (state) => ({
//   user: state.auth.user,
// });

// export default connect(mapStateToProps)(AboutScreen);


export default ChatScreen;