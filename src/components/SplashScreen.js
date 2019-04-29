import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';
import PrefManager from "../data/local/PrefManager"
import * as Animatable from 'react-native-animatable';

const prefManager = new PrefManager()
const dimensions = Dimensions.get('window');

class SplashScreen extends Component {

    componentDidMount() {
        this.timeoutHandle = setTimeout(async () => {
            this.checkForUserSession()
        }, 2000);
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutHandle);
    }

    render() {
        return (
            <Animatable.View
                animation="pulse"
                direction="alternate"
                easing="ease-out"
                iterationCount="infinite"
                style={styles.container}
            >
                <Image
                    source={require("../assets/images/qa242_logo.png")}
                    style={{ width: 250, height: 250 }}
                />
            </Animatable.View>
        );
    }

    checkForUserSession = () => {
        prefManager.isUserLoggedIn(result => {
            if (result) {
                this.navigateToHome()
            } else {
                this.navigateToLogin()
            }
        })
    }

    navigateToLogin = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    navigateToHome = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
                routeName: 'Main'
            })],
        });
        this.props.navigation.dispatch(resetAction);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: "center", alignItems: "center"
    }
});

export default SplashScreen;