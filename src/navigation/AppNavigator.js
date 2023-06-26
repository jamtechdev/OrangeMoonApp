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
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import { AppIcon, AppStyles } from '../utils/AppStyles';
import DrawerContainer from '../components/DrawerContainer';

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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
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

const AboutStack = () => (
    <Stack.Navigator
        initialRouteName="About"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="About"
            component={AboutScreen}
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

const ContactStack = () => (
    <Stack.Navigator
        initialRouteName="Contact"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="Contact"
            component={ContactScreen}
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

const BottomTab = createBottomTabNavigator();

const TabNavigator = () => (
    <BottomTab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
            tabBarInactiveTintColor: 'grey',
            tabBarActiveTintColor: AppStyles.color.tint,
            tabBarIcon: ({ focused }) => {
                return (
                    <Image
                        style={{
                            tintColor: focused ? AppStyles.color.tint : AppStyles.color.grey,
                        }}
                        source={
                            route.name === 'HomeStack'
                                ? AppIcon.images.home
                                : AppIcon.images.home
                        }
                    />
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
            options={{ tabBarLabel: 'About' }}
            name="AboutStack"
            component={AboutStack}
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
        <Drawer.Screen name="ContactStack" component={ContactStack} />
    </Drawer.Navigator>
);

const AppNavigator = () => {
    let userRole = useSelector(state => state.user); // Get user role from Redux store
    // Render the appropriate navigation based on the user role
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={userRole ? 'DrawerStack' : 'LoginStack'} // Check if user role exists
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
