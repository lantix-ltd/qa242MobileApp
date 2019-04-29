<<<<<<< HEAD
import React, { Component } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, 
    ActivityIndicator, SafeAreaView, KeyboardAvoidingView } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { defTextInputStyle, defButtonContainer, defButtonText } from '../utils/AppStyles'
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

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }}>

                <View style={styles.container}>

                    <Image style={{ width: 200, height: 200 }} source={require("../assets/images/qa242_logo.png")} />

                    <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 20 }}>Account Login</Text>

                    <View style={defTextInputStyle.inputsection}>
                        <Icon name="user" style={defTextInputStyle.icon} size={15} color="#797979" />
                        <TextInput style={[defTextInputStyle.input]}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='email-address'
                            returnKeyType="next"
                            value={this.state.username}
                            placeholder='* Username / Email'
                            onChangeText={(text) => this.setState({ email: text })}
                            placeholderTextColor='#797979' />
                    </View>
                    <View style={defTextInputStyle.inputsection}>
                        <Icon name="lock" style={defTextInputStyle.icon} size={15} color="#797979" />
                        <View
                            style={[defTextInputStyle.input, { flexDirection: "row", padding: 0 }]}>
                            <TextInput style={{ flex: 1, height: 40, padding: 10 }}
                                returnKeyType="go"
                                placeholder='* Password'
                                value={this.state.password}
                                onChangeText={(text) => this.setState({ password: text })}
                                placeholderTextColor='#797979'
                                secureTextEntry={this.state.hidePassword} />
                            <TouchableOpacity
                                onPress={() => this.togglePwdVisibility()}>
                                <Icon name={this.state.hidePassword ? "eye-off" : "eye"} style={[styles.icon, { borderBottomWidth: 0, top: 1, padding: 10, left: 5 }]} size={16} color="#797979" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity activeOpacity={0.9} style={{}}
                            onPress={() => { this.handleForgotPwd() }}>
                            <Text style={{ fontSize: 14, color: "blue" }}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        {!this.state.isLoading &&
                            <TouchableOpacity activeOpacity={0.9} style={[{ width: 200 }, defButtonContainer]}
                                onPress={() => this.loginUser(this.state.email, this.state.password)}>
                                <Text style={defButtonText}>LOGIN</Text>
                            </TouchableOpacity>
                        }
                        {this.state.isLoading &&
                            <ActivityIndicator size="large" />
                        }

                    </View>

                </View>
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
            MyUtils.showSnackbar("Empty fields not allowed", "")
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
        backgroundColor: 'white',
        justifyContent: "center", alignItems: "center"
    }
});

=======
import React, { Component } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, 
    ActivityIndicator, SafeAreaView, KeyboardAvoidingView } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { defTextInputStyle, defButtonContainer, defButtonText } from '../utils/AppStyles'
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

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }}>

                <View style={styles.container}>

                    <Image style={{ width: 200, height: 200 }} source={require("../assets/images/qa242_logo.png")} />

                    <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 20 }}>Account Login</Text>

                    <View style={defTextInputStyle.inputsection}>
                        <Icon name="user" style={defTextInputStyle.icon} size={15} color="#797979" />
                        <TextInput style={[defTextInputStyle.input]}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='email-address'
                            returnKeyType="next"
                            value={this.state.username}
                            placeholder='* Username / Email'
                            onChangeText={(text) => this.setState({ email: text })}
                            placeholderTextColor='#797979' />
                    </View>
                    <View style={defTextInputStyle.inputsection}>
                        <Icon name="lock" style={defTextInputStyle.icon} size={15} color="#797979" />
                        <View
                            style={[defTextInputStyle.input, { flexDirection: "row", padding: 0 }]}>
                            <TextInput style={{ flex: 1, height: 40, padding: 10 }}
                                returnKeyType="go"
                                placeholder='* Password'
                                value={this.state.password}
                                onChangeText={(text) => this.setState({ password: text })}
                                placeholderTextColor='#797979'
                                secureTextEntry={this.state.hidePassword} />
                            <TouchableOpacity
                                onPress={() => this.togglePwdVisibility()}>
                                <Icon name={this.state.hidePassword ? "eye-off" : "eye"} style={[styles.icon, { borderBottomWidth: 0, top: 1, padding: 10, left: 5 }]} size={16} color="#797979" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity activeOpacity={0.9} style={{}}
                            onPress={() => { this.handleForgotPwd() }}>
                            <Text style={{ fontSize: 14, color: "blue" }}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        {!this.state.isLoading &&
                            <TouchableOpacity activeOpacity={0.9} style={[{ width: 200 }, defButtonContainer]}
                                onPress={() => this.loginUser(this.state.email, this.state.password)}>
                                <Text style={defButtonText}>LOGIN</Text>
                            </TouchableOpacity>
                        }
                        {this.state.isLoading &&
                            <ActivityIndicator size="large" />
                        }

                    </View>

                </View>
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
            MyUtils.showSnackbar("Empty fields not allowed", "")
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
        backgroundColor: 'white',
        justifyContent: "center", alignItems: "center"
    }
});

>>>>>>> b6a1ebb00a45edb093387e51e55ebc3e6914a0d7
export default UserLogin;