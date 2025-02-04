import React, { Component } from "react";
import { createStackNavigator, createBottomTabNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation'
import { createStore, combineReducers } from "redux"
import { Provider } from "react-redux"

import Icon from 'react-native-vector-icons/Feather';

import SplashScreen from './src/components/SplashScreen'
import UserLogin from './src/components/UserLogin'
import NotificationsScreen from './src/components/NotificationsScreen'

import Checks from './src/components/main/Checks'
import Chats from './src/components/main/Chats'
import Contact from './src/components/main/Contact'
import InputForms from './src/components/main/InputForms'

import MainDrawerHeader from "./src/utils/MainDrawerHeader"
import ConversationScreen from "./src/components/ConversationScreen"
import AboutUs from './src/components/AbouUs'
import Profile from './src/components/Profile'
import UpdatePassword from './src/components/UpdatePassword'
import CheckDetailForm from './src/components/check_input_screens/CheckDetailForm'
import CheckDetailView from './src/components/check_view_screens/CheckDetailView'
import LinesAndShiftScreen from "./src/components/LinesAndShiftScreen"
import MyVideoPlayer from "./src/utils/MyVideoPlayer"

import ChatNotificationIcon from './src/utils/ChatNotificationIcon'

import FormDetail from "./src/components/static_forms/FormDetail"

import { primaryColor, appGreyColor, appPinkColor } from './src/utils/AppStyles';
import { Dimensions, StyleSheet, View } from "react-native"

import PrefManager from "./src/data/local/PrefManager"
import WebHandler from "./src/data/remote/WebHandler"
import LocalDBManager from "./src/data/local/LocalDBManager";

const win = Dimensions.get('window');
const width = win.width * 70 / 100
const prefManager = new PrefManager()
const webHandler = new WebHandler()
const localDB = new LocalDBManager()

const BottomNavigation = createBottomTabNavigator({
    Checks: {
        screen: Checks, navigationOptions: {
            tabBarLabel: 'Checks',
            tabBarIcon: ({ tintColor }) => <Icon size={22} style={{ marginVertical: 2 }} name="check-circle" color={tintColor} />
        }
    },
    Chats: {
        screen: Chats, navigationOptions: {
            tabBarLabel: 'Chats',
            // tabBarIcon: ({ tintColor }) => <Icon size={22} style={{ marginVertical: 2 }} name="message-circle" color={tintColor} />
            tabBarIcon: ({ tintColor }) => <ChatNotificationIcon tintColor={tintColor} />
        }
    },
    Contact: {
        screen: Contact, navigationOptions: {
            tabBarLabel: 'Contact',
            tabBarIcon: ({ tintColor }) => <Icon size={22} style={{ marginVertical: 2 }} name="users" color={tintColor} />
        }
    },
    InputForms: {
        screen: InputForms, navigationOptions: {
            tabBarLabel: 'Forms',
            tabBarIcon: ({ tintColor }) => <Icon size={22} style={{ marginVertical: 2 }} name="clipboard" color={tintColor} />
        }
    },
},
    {
        tabBarOptions: {
            showLabel: true, // hide labels
            labelStyle: { fontSize: 12, fontWeight: "bold" },
            activeTintColor: "#fff", // active icon color
            inactiveTintColor: "#858585",  // inactive icon color
            activeBackgroundColor: "#F75473",
            style: {
                backgroundColor: "#F4F4F4" // TabBar background
            },
        }
    }
);

const DrawerNavigator = createDrawerNavigator({
    Home: {
        screen: BottomNavigation,
        navigationOptions: {
            drawerLabel: 'Home',
            drawerIcon: ({ tintColor }) => (<Icon name="home" size={17} color={tintColor} />),
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            drawerLabel: 'My Profile',
            drawerIcon: ({ tintColor }) => (<Icon name="user" size={17} color={tintColor} />),
        }
    },
    UpdatePassword: {
        screen: UpdatePassword,
        navigationOptions: {
            drawerLabel: 'Change Password',
            drawerIcon: ({ tintColor }) => (<Icon name="lock" size={17} color={tintColor} />),
        }
    },
    LinesAndShift: {
        screen: LinesAndShiftScreen,
        navigationOptions: {
            drawerLabel: 'Change Lines & Shift',
            drawerIcon: ({ tintColor }) => (<Icon name="sliders" size={17} color={tintColor} />),
        }
    },
    AboutUs: {
        screen: AboutUs,
        navigationOptions: {
            drawerLabel: 'About',
            drawerIcon: ({ tintColor }) => (<Icon name="info" size={17} color={tintColor} />),
        }
    },
    Quit: {
        screen: AboutUs,
        navigationOptions: {
            drawerLabel: 'Quit',
            drawerIcon: ({ tintColor }) => (<Icon style={{ padding: 5 }} name="log-out" size={17} color={tintColor} />),
        }
    }
}, {
    initialRouteName: 'Home',
    drawerWidth: width,
    contentComponent: MainDrawerHeader,
    contentOptions: {
        activeBackgroundColor: appPinkColor,
        activeTintColor: "#fff",
        inactiveTintColor: appGreyColor,
    }
});

const RootStack = createStackNavigator({
    Splash: {
        screen: SplashScreen, navigationOptions: {
            header: null
        }
    },
    Login: {
        screen: UserLogin, navigationOptions: {
            header: null
        }
    },
    Main: {
        screen: DrawerNavigator, navigationOptions: {
            header: null
        }
    },
    Conversation: {
        screen: ConversationScreen,
    },
    Notifications: {
        screen: NotificationsScreen,
    },
    CheckDetailForm: {
        screen: CheckDetailForm,
    },
    CheckDetailView: {
        screen: CheckDetailView,
    },
    MyVideoPlayer: {
        screen: MyVideoPlayer,
    },
    FormDetail: {
        screen: FormDetail,
    }
})
const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {

    componentWillUnmount() {
        // prefManager.cleanLinesAndShiftData()
        prefManager.destroyUserSession()
        localDB.removeLastFetchedData()
        webHandler.logOutUser(
            (responseJson) => {
                console.log("Logged Out!")
            },
            (error) => {
                console.log("LogOut Error: " + error)
            })
    }

    render() {
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        );
    }
}

const initialState = {
    counter: 0,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_NOTIFICATIONS_COUNTER":
            return { counter: action.counts }
        case "RESET_NOTIFICATIONS_COUNTER":
            return { counter: 0 }
    }
    return state
}

const initialState2 = {
    chat_counter: 0
}

const reducer2 = (state = initialState2, action) => {
    switch (action.type) {
        case "UPDATE_CHAT_MSG_COUNTER":
            return { chat_counter: action.chat_counter }
        case "RESET_CHAT_MSG_COUNTER":
            return { chat_counter: 0 }
    }
    return state
}

const reducers = combineReducers({ reducer, reducer2 })
const store = createStore(reducers)