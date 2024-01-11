/* eslint-disable prettier/prettier */
import React, { useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { AppIcon, AppStyles } from '../utils/AppStyles';
import { Configuration } from '../utils/Configuration';
import { GiftedChat } from 'react-native-gifted-chat';
import { chatService } from '../utils/_services';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { IMAGE_URL, ADMIN_ID, APP_URL, CHAT_PATH } from '../utils/Connection';
import { useFocusEffect } from '@react-navigation/native';
import { unreadCount } from '../redux/actions/authActions';
function ChatScreen({ navigation, user, token, unreadCountAction, count }) {

    const [messages, setMessages] = useState([])
    const [page, setPage] = useState(1)
    const [socket, setSocket] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            getAllMessage()
            const newSocket = io('https://dev.orangemoonsss.com', {
                auth: {
                    token: user?.monitor?.user_id,
                    source_url: APP_URL,
                    page_path: CHAT_PATH,
                },
            });

            newSocket.on('connect', () => {
                console.log('Connected to socket.io chat');
            });

            setSocket(newSocket);

            return () => {
                if (newSocket) {
                    newSocket.disconnect();
                    console.log('Disconnected from socket.io chat');
                }
            };
        }, [token, count])
    );


    const getAllMessage = () => {
        chatService.getConversation(token, user.id, ADMIN_ID, page).then(res => {
            console.log(res, "get getConversation data");
            let response = res?.data?.data.reverse()
            if (response) {
                const transformedData = response.map(item => {
                    return {
                        _id: item.id,             // Use receiver_id as _id
                        text: item.message,              // Use message as text
                        createdAt: new Date(item.date_time), // Convert date_time to a Date object
                        user: {
                            _id: item.sender_id,         // Use receiver_id as _id for the user
                            name: item.sender_name,      // Use sender_name as name
                            avatar: IMAGE_URL + item.sender_img,     // Use sender_img as avatar
                        },
                    };
                });
                setMessages(transformedData)
            }

        }).catch(error => console.log(error))
        getUpdateUnreadCount()
    }
    const getUpdateUnreadCount = () => {
        chatService.updateUnreadMassage(token, ADMIN_ID, user.id).then(res => {
            console.log(res, "here my console res update msg");
            unreadCountAction(0);
        }).catch(error => console.log(error))
    }

    useEffect(() => {
        if (!socket) return;
        // Listen for incoming messages
        socket.on('new-message', (message) => {
            console.log(message, "new message", user)
            if (message?.receiver_id === user?.id) {
                let newMessages = [
                    {
                        "text": message.msg,
                        "user": {
                            "_id": message.sender_id,
                            "name": message.sender_name,
                            "avatar": IMAGE_URL + message.sender_image
                        },
                        "createdAt": new Date().toISOString(),
                        "_id": Math.floor(Math.random() * 111111111111111111),
                    }
                ];
                // if (message?.sender_id === user?.id) {
                //     setMessages((previousMessages) =>
                //         GiftedChat.append(previousMessages, newMessages)
                //     );
                // }
                getUpdateUnreadCount()
                setMessages((previousMessages) =>
                    GiftedChat.append(previousMessages, newMessages)
                );
            }

        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, count]);

    const handleSend = (newMessages) => {
        console.log(newMessages)
        const sendData = {
            message: newMessages[0]?.text,
            sender_id: user.id,
            receiver_id: ADMIN_ID,
            sender_name: newMessages[0]?.user?.name,
            receiver_name: 'Orangemoon',
            sender_img: user.monitor.photo,
            receiver_img: 'site-logo.png',
            status: 'unread'
        }
        const newMessagesData = {
            msg: newMessages[0]?.text,
            sender_id: user.id,
            receiver_id: ADMIN_ID,
            sender_name: newMessages[0]?.user?.name,
            receiver_name: 'Orangemoon',
            sender_img: '1672486286.jpg',
            receiver_img: 'site-logo.png',
            status: 'unread'
        }
        socket.emit('new-message', newMessagesData);
        chatService.postConversation(token, sendData).then(res => {
            console.log(res, "here my send data ");
            setMessages((previousMessages) =>
                GiftedChat.append(previousMessages, newMessages)
            );
        }).catch(error => console.log(error))
    };






    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={handleSend}
                user={{
                    _id: user?.id,
                    name: user?.first_name + ' ' + user?.last_name,
                    avatar: IMAGE_URL + '1672486286.jpg',
                }}
                renderUsernameOnMessage={true}
                showUserAvatar={false}
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

const mapStateToProps = (state) => ({
    user: state.auth.user,
    token: state.auth.token,
    count: state.auth.count
});
const mapDispatchToProps = dispatch => ({
    unreadCountAction: id => dispatch(unreadCount(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
