/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React,{useState} from 'react';
import { Image, Pressable, StyleSheet, ActivityIndicator, Text , View } from 'react-native';
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
import BookingDetails from '../screens/BookingDetails';
import ArchiveBooking from '../screens/ArchiveBooking';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfile';
import Scheduling from '../screens/Scheduling';
import CompleteReport from '../screens/CompleteReport';
import SubReports from '../screens/SubReports';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import ChatScreen from '../screens/Chat';
import PaymentScreen from '../screens/PaymentScreen';
import { AppIcon, AppStyles } from '../utils/AppStyles';
import DrawerContainer from '../components/DrawerContainer';
import Icon from 'react-native-vector-icons/FontAwesome';
import DetailsReport from '../screens/DetailsReport';
import { useRoute } from '@react-navigation/native';
import { authService } from '../utils/_services';
import Splash from '../components/Splash';

const Stack = createStackNavigator();

// login stack
const LoginStack = () => (
    <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
            headerBackTitleVisible: false,
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Sign-In" component={LoginScreen} />
        <Stack.Screen name="Sign-Up" component={SignupScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
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
            component={BookingRequest}
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
const BookingDetailsStack = () => (
    <Stack.Navigator
        initialRouteName="Booking Details"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="Booking Details"
            component={BookingDetails}
            options={({ navigation }) => ({
                // headerLeft: () => (
                //     <Pressable onPress={() => navigation.goBack()}>
                //         <Icon color={AppStyles.color?.tint} name='arrow-left' size={30} />
                //     </Pressable>
                // ),
                headerBackTitleVisible: false,
                headerLeftContainerStyle: { paddingLeft: 10 },
                title: 'Booking Details',
            })}
        />
    </Stack.Navigator>
);
const ArchiveBookingStack = () => (
    <Stack.Navigator
        initialRouteName="Archive Booking"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="Archive Booking"
            component={ArchiveBooking}
            options={({ navigation }) => ({
                headerLeft: () => (
                    <Pressable onPress={() => navigation.openDrawer()}>
                        <Image style={styles.iconStyle} source={AppIcon.images.menu} />
                    </Pressable>
                ),
                headerLeftContainerStyle: { paddingLeft: 10 },
                title: 'Archive Booking',
            })}
        />
    </Stack.Navigator>
);

const CompleteReportStack = () => (
    <Stack.Navigator
        initialRouteName="Complete Report"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="Complete Report"
            component={CompleteReport}
            options={({ navigation }) => ({
                headerLeft: () => (
                    <Pressable onPress={() => navigation.openDrawer()}>
                        <Image style={styles.iconStyle} source={AppIcon.images.menu} />
                    </Pressable>
                ),
                headerLeftContainerStyle: { paddingLeft: 10 },
                title: 'Completed Reports',
            })}
        />
    </Stack.Navigator>
);

const SubReportStack = () => (
    <Stack.Navigator
        initialRouteName="Sub-Report"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="Sub-Report"
            component={SubReports}
            options={({ navigation }) => ({
                // headerLeft: () => (
                //     <Pressable onPress={() => navigation.goBack()}>
                //         <Icon color={AppStyles.color?.tint} name='arrow-left' size={30} />
                //     </Pressable>
                // ),
                headerBackTitleVisible: false,
                headerLeftContainerStyle: { paddingLeft: 10 },
                title: 'Sub-Report',
            })}
        />
    </Stack.Navigator>
);

const SchedulingStack = () => (
    <Stack.Navigator
        initialRouteName="Scheduling"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="Scheduling"
            component={Scheduling}
            options={({ navigation }) => ({
                headerLeft: () => (
                    <Pressable onPress={() => navigation.openDrawer()}>
                        <Image style={styles.iconStyle} source={AppIcon.images.menu} />
                    </Pressable>
                ),
                headerLeftContainerStyle: { paddingLeft: 10 },
                title: 'Scheduling',
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
                title: 'Conversations',
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
const EditProfileStack = () => (
    <Stack.Navigator
        initialRouteName="Edit Profile"
        screenOptions={{
            headerTintColor: 'red',
            headerTitleStyle: styles.headerTitleStyle,
            headerMode: 'float',
        }}>
        <Stack.Screen
            name="Edit Profile"
            component={EditProfileScreen}
            options={({ navigation }) => ({
                // headerLeft: () => (
                //     <Pressable onPress={() => navigation.goBack()}>
                //         <Icon color={AppStyles.color?.tint} name='arrow-left' size={30} />
                //     </Pressable>
                // ),
                headerBackTitleVisible: false,
                headerLeftContainerStyle: { paddingLeft: 10 },
                title: 'Edit Profile',
            })}
        />
    </Stack.Navigator>
);

const DetailsReportStack = () => {
    const route = useRoute();
    console.log(route, "here route ise ")
    return (
        <Stack.Navigator
            initialRouteName="Details"
            screenOptions={{
                eaderShown: true,
                headerTintColor: 'red',
                headerTitleStyle: styles.headerTitleStyle,
                headerMode: 'float',
            }}>
            <Stack.Screen
                name="Details"
                component={() => <DetailsReport route={route} />}
                options={({ navigation }) => ({
                    // headerLeft: () => (
                    //     <Pressable onPress={() => navigation.goBack()}>
                    //         <Icon color={AppStyles.color?.tint} name='arrow-left' size={30} />
                    //     </Pressable>
                    // ),
                    headerBackTitleVisible: false,
                    headerLeftContainerStyle: { paddingLeft: 10 },
                    title: 'Details',
                })}
            />
        </Stack.Navigator>
    )
};


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
                title: 'Payments',
            })}
        />
    </Stack.Navigator>
);
const getIconName = (name) => {
    const { home, defaultUser, chat } = AppIcon.images;
    if (name === 'HomeStack') {
        return 'home';
    } else if (name === 'BookingRequestStack') {
        return 'book';
    } else if (name === 'ProfileStack') {
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
        <Drawer.Screen name="ArchiveBookingStack" component={ArchiveBookingStack} />
        <Drawer.Screen name="SchedulingStack" component={SchedulingStack} />
        <Drawer.Screen name="CompleteReportStack" component={CompleteReportStack} />
    </Drawer.Navigator>
);


const AppNavigator = () => {
    let auth = useSelector((state) => state.auth); // Get user role from Redux store
    const { token } = auth;
    const [appInitialized, setAppInitialized] = useState(0);
    // Render the appropriate navigation based on the user role
    authService.tokenCheck(token).then(res=>{
        console.log(res, "result")
    setAppInitialized(1)
    }).catch(error=>{
        setAppInitialized(2);
        console.log(error, "token error")
    })

    if (appInitialized == 0) {
        return (
            <Splash />
        //     <View style={styles.container}>
        //     <ActivityIndicator size="large" color={AppStyles.color.tint} />
        //     <Text>Loading...</Text>
        //   </View>
        );
      } else {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={appInitialized == 1 ? 'DrawerStack' : 'LoginStack'} // Check if user role exists
                screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoginStack" component={LoginStack} />
                <Stack.Screen name="DrawerStack" component={DrawerStack} />
                <Stack.Screen name="BookingDetails" component={BookingDetailsStack} />
                <Stack.Screen name="SubReport" component={SubReportStack} />
                <Stack.Screen name="EditProfile" component={EditProfileStack} />
                <Stack.Screen name="DetailsReport" component={DetailsReportStack} />
            </Stack.Navigator>
        </NavigationContainer>
    );
      }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        color: 'black',
    },
    iconStyle: { tintColor: AppStyles.color.tint, width: 30, height: 30 },
});

export default AppNavigator;
