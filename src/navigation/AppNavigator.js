/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux'; // Import useSelector from react-redux
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import BookingRequest from '../screens/BookingRequest';
import ProfileScreen from '../screens/ProfileScreen';
import forgetPasswordScreen from '../screens/forgetPasswordScreen';
import ChatScreen from '../screens/Chat';
import PaymentScreen from '../screens/PaymentScreen';
import { AppIcon, AppStyles } from '../utils/AppStyles';
import DrawerContainer from '../components/DrawerContainer';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

// login stack
const LoginStack = () => (
    <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Sign-In" component={LoginScreen} />
        <Stack.Screen name="Sign-Up" component={SignupScreen} />
        <Stack.Screen name="forgetPassword" component={forgetPasswordScreen} />
    </Stack.Navigator>
);

const HomeStack = () => (
    <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
                headerLeft: () => (
                    <Pressable onPress={() => navigation.openDrawer()}>
                        <Image style={styles.iconStyle} source={AppIcon.images.menu} />
                    </Pressable>
                ),
                headerLeftContainerStyle: { paddingLeft: 10 },
            })}
        />
    </Stack.Navigator>
);

const BookingRequestStack = () => (
    <Stack.Navigator
        initialRouteName="Booking"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="Booking"
            component={BookingRequest}rt
            options={({ navigation }) => ({
                headerLeft: () => (
                    <Pressable onPress={() => navigation.openDrawer()}>
                        <Image style={styles.iconStyle} source={AppIcon.images.menu} />
                    </Pressable>
                ),
                headerLeftContainerStyle: { paddingLeft: 10 },
                title: 'Booking Request',
            })}
        />
    </Stack.Navigator>
);

const ChatStack = () => (
    <Stack.Navigator
        initialRouteName="Chat"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={({ navigation }) => ({
                headerLeft: () => (
                    <Pressable onPress={() => navigation.openDrawer()}>
                        <Image style={styles.iconStyle} source={AppIcon.images.menu} />
                    </Pressable>
                ),
                headerLeftContainerStyle: { paddingLeft: 10 },
                title: 'Chat',
            })}
        />
    </Stack.Navigator>
);
const ProfileStack = () => (
    <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={({ navigation }) => ({
                headerLeft: () => (
                    <Pressable onPress={() => navigation.openDrawer()}>
                        <Image style={styles.iconStyle} source={AppIcon.images.menu} />
                    </Pressable>
                ),
                headerLeftContainerStyle: { paddingLeft: 10 },
                title: 'Profile',
            })}
        />
    </Stack.Navigator>
);

const PaymentStack = () => (
    <Stack.Navigator
        initialRouteName="Payment"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={({ navigation }) => ({
                headerLeft: () => (
                    <Pressable onPress={() => navigation.openDrawer()}>
                        <Image style={styles.iconStyle} source={AppIcon.images.menu} />
                    </Pressable>
                ),
                headerLeftContainerStyle: { paddingLeft: 10 },
                title: 'Payment',
            })}
        />
    </Stack.Navigator>
);
const getIconName = (name) => {
    const { home, defaultUser, chat } = AppIcon.images;
    if (name === 'HomeStack'){
        return 'home';
    } else if (name === 'BookingRequestStack'){
        return 'book';
    } else if (name === 'ProfileStack'){
        return 'user-o';
    } else {
        return 'home';
    }
}
const BottomTab = createBottomTabNavigator();

const TabNavigator = () => (
    <BottomTab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
            tabBarInactiveTintColor: 'grey',
            tabBarActiveTintColor: AppStyles.color.tint,
            tabBarIcon: ({ focused }) => {
                return (
                    // <Image
                    //     style={{
                    //         tintColor: focused ? AppStyles.color.tint : AppStyles.color.grey,
                    //     }}
                    //     source={}
                    // />
                    <Icon name={getIconName(route.name)} size={30} color={focused ? AppStyles.color.tint : AppStyles.color.grey} />
                );
            },
            headerShown: false,
        })}>
        <BottomTab.Screen
            options={{ tabBarLabel: 'Home' }}
            name="HomeStack"
            component={HomeStack}
        />
        <BottomTab.Screen
            options={{ tabBarLabel: 'Booking Request' }}
            name="BookingRequestStack"
            component={BookingRequestStack}
        />
        <BottomTab.Screen
            options={{ tabBarLabel: 'Profile' }}
            name="ProfileStack"
            component={ProfileStack}
        />
    </BottomTab.Navigator>
);

const Drawer = createDrawerNavigator();
const DrawerStack = () => (
    <Drawer.Navigator
        screenOptions={{
            drawerStyle: { outerWidth: 200 },
            drawerPosition: 'left',
            headerShown: false,
        }}
        drawerContent={({ navigation }) => (
            <DrawerContainer navigation={navigation} />
        )}>
        <Drawer.Screen name="Tab" component={TabNavigator} />
        <Drawer.Screen name="ChatStack" component={ChatStack} />
        <Drawer.Screen name="PaymentStack" component={PaymentStack} />
    </Drawer.Navigator>
);

const AppNavigator = () => {
    let auth = useSelector((state) => state.auth); // Get user role from Redux store
    const { token } = auth;
    // Render the appropriate navigation based on the user role
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={token ? 'DrawerStack' : 'LoginStack'} // Check if user role exists
                screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoginStack" component={LoginStack} />
                <Stack.Screen name="DrawerStack" component={DrawerStack} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        color: 'black',
    },
    iconStyle: { tintColor: AppStyles.color.tint, width: 30, height: 30 },
});

export default AppNavigator;
