import React, { Component } from "react";
import {
    View, Text, TextInput, Image, StyleSheet, TouchableOpacity,
    ActivityIndicator, ImageBackground, KeyboardAvoidingView
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import MyUtils from "../utils/MyUtils";
import { StackActions, NavigationActions } from 'react-navigation';
import PrefManager from "../data/local/PrefManager"
import WebHandler from "../data/remote/WebHandler"
import firebase from "react-native-firebase"

const webHandler = new WebHandler()
const prefManager = new PrefManager()

class UserLogin extends Component {

    constructor(props) {
        super(props)
        this.state = ({
            isLoading: false,
            email: "",
            password: "",
            hidePassword: true
        })
    }

    componentDidMount() {
        // prefManager.isUserLoggedIn(result => {
        //     if (result) {
        //         prefManager.getLoginCredential((userName, userPass) => {
        //             this.setState({ email: userName, password: userPass })
        //         })
        //     }
        // })
    }

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }}>

                <ImageBackground
                    source={require("../assets/images/login_bg_pattern.png")}
                    style={{ width: "100%", height: "100%" }}
                >

                    <View style={styles.container}>

                        <View style={{ flex: 1 }} />

                        <Image style={{ width: 200, height: 200 }} source={require("../assets/images/qa242_new_logo.png")} />

                        <View
                            style={[styles.round_white_bg, { flexDirection: "row", padding: 0, marginHorizontal: 15, marginBottom: 10 }]}>
                            {/* <Icon name="user" style={defTextInputStyle.icon} size={15} color="#797979" /> */}
                            <TextInput style={{ flex: 1, textAlign: "center", height: 40, padding: 10 }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType='email-address'
                                returnKeyType="next"
                                value={this.state.email}
                                placeholder='User Name'
                                onChangeText={(text) => this.setState({ email: text })}
                                placeholderTextColor='#AAAAAA' />
                        </View>
                        <View
                            style={[styles.round_white_bg, { flexDirection: "row", padding: 0, marginHorizontal: 15, marginBottom: 10 }]}>
                            <TextInput style={{ flex: 1, textAlign: "center", height: 40, padding: 10 }}
                                returnKeyType="go"
                                placeholder='        Password'
                                value={this.state.password}
                                onChangeText={(text) => this.setState({ password: text })}
                                placeholderTextColor='#AAAAAA' ø
                                secureTextEntry={this.state.hidePassword} />
                            <TouchableOpacity
                                onPress={() => this.togglePwdVisibility()}>
                                <Icon name={this.state.hidePassword ? "eye-off" : "eye"} style={[styles.icon, { borderBottomWidth: 0, top: 1, padding: 10, left: 5 }]} size={16} color="#797979" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: "row", padding: 0, marginHorizontal: 15, marginBottom: 10, marginTop: 5 }}>
                            {!this.state.isLoading &&
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={[styles.round_pink_btn_bg, { flex: 1, height: 40, justifyContent: "center" }]}
                                    onPress={() => this.loginUser(this.state.email, this.state.password)}>
                                    <Text style={{ textAlign: "center", fontSize: 17, fontWeight: "bold", color: "#fff" }}>Login</Text>
                                </TouchableOpacity>
                            }
                            {this.state.isLoading &&
                                <ActivityIndicator size="large" />
                            }

                        </View>

                        {/* <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 15, }}>
                            <TouchableOpacity activeOpacity={0.9} style={{}}
                                onPress={() => { this.handleForgotPwd() }}>
                                <Text style={{ fontSize: 15, color: "#AAAAAA", textDecorationLine: "underline" }} >Lost Password?</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }} />
                            <TouchableOpacity activeOpacity={0.9} style={{}}
                                onPress={() => { this.handleForgotPwd() }}>
                                <Text style={{ fontSize: 15, color: "#AAAAAA", textDecorationLine: "underline" }} >New Member</Text>
                            </TouchableOpacity>
                        </View> */}


                        <View style={{ flex: 1 }} />

                        <Text style={{ fontSize: 12, color: "#000", marginVertical: 5 }} >Copyright all rights reserved 2019.</Text>
                    </View>


                </ImageBackground>

            </KeyboardAvoidingView>
        );
    }

    togglePwdVisibility() {
        this.setState({ hidePassword: !this.state.hidePassword });
    }

    async loginUser(email, password) {
        var em = email.toString().trim();
        var pwd = password.toString().trim();
        if (em == "" || pwd == "") {
            MyUtils.showSnackbar("Please type valid username & password", "")
        } else {
            this.setState({ isLoading: true })
            let myFcmToken = ""
            const fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                myFcmToken = fcmToken
            }
            webHandler.loginUser(email, password, myFcmToken,
                (responseJson) => {
                    setTimeout(() => {
                        this.navigateToHome()
                    }, 2000)
                }, (error) => {
                    this.setState({ isLoading: false })
                    MyUtils.showSnackbar(error, "")
                }
            )
        }
    }

    handleForgotPwd() {
        MyUtils.showSnackbar("handle forgot password", "")
    }

    navigateToHome = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
                routeName: 'Main',
            })],
        });
        this.props.navigation.dispatch(resetAction);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        // backgroundColor: '#F4F4F4',
        justifyContent: "center", alignItems: "center"
    },
    round_white_bg: {
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderRadius: 5
    },
    round_pink_btn_bg: {
        backgroundColor: '#F75473',
        overflow: 'hidden',
        borderRadius: 5
    }

});

export default UserLogin;