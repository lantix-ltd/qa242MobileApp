import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, SafeAreaView } from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';
import PrefManager from "../data/local/PrefManager"
import * as Animatable from 'react-native-animatable';

const prefManager = new PrefManager()
const dimensions = Dimensions.get('window');

class SplashScreen extends Component {

    componentDidMount() {
        this.timeoutHandle = setTimeout(async () => {
            // this.checkForUserSession()
            this.navigateToLogin()
        }, 2000);
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutHandle);
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ImageBackground
                    source={require("../assets/images/splash_bg_pattern.png")}
                    style={{ width: "100%", height: "100%" }}
                >
                    <View style={{ marginTop: 20, justifyContent: "center", alignItems: "center" }}>
                        <Animatable.View
                            animation="pulse"
                            direction="alternate"
                            easing="ease-out"
                            iterationCount="infinite"
                        >
                            <Image
                                source={require("../assets/images/qa242_new_logo.png")}
                                style={{ width: 250, height: 250 }}
                            />
                        </Animatable.View>
                    </View>

                    <View style={{ flex: 1 }} />
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1 }} />
                        <Text style={{ padding: 5, fontSize: 12, color: "#000", backgroundColor: "#FFF", marginVertical: 5 }} >
                            Copyright all rights reserved 2019. </Text>
                        <View style={{ flex: 1 }} />
                    </View>

                </ImageBackground>
            </SafeAreaView>
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
        justifyContent: "center", alignItems: "center"
    }
});

export default SplashScreen;