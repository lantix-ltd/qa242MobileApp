import React, { Component } from "react";
import {
    View, Text, TextInput, Image, StyleSheet, TouchableOpacity,
    ActivityIndicator, ImageBackground, KeyboardAvoidingView,
    SafeAreaView, Picker
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import MyUtils from "../utils/MyUtils";
import { StackActions, NavigationActions } from 'react-navigation';
import PrefManager from "../data/local/PrefManager"
import WebHandler from "../data/remote/WebHandler"
import firebase from "react-native-firebase"
import { connect } from "react-redux"

const webHandler = new WebHandler()
const prefManager = new PrefManager()

class UserLogin extends Component {

    constructor(props) {
        super(props)
        this.state = ({
            isLoading: false,
            email: "",
            password: "",
            hidePassword: true,
            isGroupSelection: false,
            respData: null,
            userGroups: [],
            selectedGroupId: "",
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
            <SafeAreaView style={{ flex: 1 }}>

                <KeyboardAvoidingView style={{ flex: 1 }}>

                    <ImageBackground
                        source={require("../assets/images/login_bg_pattern.png")}
                        style={{ width: "100%", height: "100%" }}
                    >

                        <View style={styles.container}>

                            <View style={{ flex: 1 }} />

                            <Image style={{ width: 200, height: 200 }} resizeMode="center" source={require("../assets/images/eqsmart_logo.png")} />

                            {!this.state.isGroupSelection &&
                                <View
                                    style={[styles.round_white_bg, { flexDirection: "row", padding: 0, marginHorizontal: 15, marginBottom: 10 }]}>
                                    {/* <Icon name="user" style={defTextInputStyle.icon} size={15} color="#797979" /> */}
                                    <TextInput style={{ flex: 1, textAlign: "left", height: 40, padding: 10 }}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType='email-address'
                                        returnKeyType="next"
                                        value={this.state.email}
                                        placeholder='User Name'
                                        onChangeText={(text) => this.setState({ email: text })}
                                        placeholderTextColor='#AAAAAA' />
                                </View>
                            }
                            {!this.state.isGroupSelection &&
                                <View
                                    style={[styles.round_white_bg, { flexDirection: "row", padding: 0, marginHorizontal: 15, marginBottom: 10 }]}>
                                    <TextInput style={{ flex: 1, textAlign: "left", height: 40, padding: 10 }}
                                        returnKeyType="go"
                                        placeholder='Password'
                                        value={this.state.password}
                                        onChangeText={(text) => this.setState({ password: text })}
                                        placeholderTextColor='#AAAAAA' ø
                                        secureTextEntry={this.state.hidePassword} />
                                    <TouchableOpacity
                                        onPress={() => this.togglePwdVisibility()}>
                                        <Icon name={this.state.hidePassword ? "eye-off" : "eye"} style={[styles.icon, { borderBottomWidth: 0, top: 1, padding: 10, left: 5 }]} size={16} color="#797979" />
                                    </TouchableOpacity>
                                </View>
                            }

                            {/* {this.state.isGroupSelection && !MyUtils.isEmptyArray(this.state.userGroups) &&
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5, marginHorizontal: 18, }}>Role:</Text>
                                    <View style={[styles.round_white_bg, { flexDirection: "row", padding: 0, marginHorizontal: 15, marginBottom: 10 }]}>
                                        <Picker
                                            selectedValue={this.state.selectedGroupId}
                                            style={{ height: 50, width: '100%' }}
                                            onValueChange={(itemValue, itemIndex) =>
                                                this.setState({ selectedGroupId: itemValue })
                                            }>
                                            {this.state.userGroups.map((item, index) => {
                                                return (
                                                    <Picker.Item key={item.id} label={item.key} value={item.id} />
                                                )
                                            })}
                                        </Picker>
                                    </View>
                                </View>
                            } */}

                            <View style={{ flexDirection: "row", padding: 0, marginHorizontal: 15, marginBottom: 10, marginTop: 5 }}>
                                {!this.state.isLoading && !this.state.isGroupSelection &&
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        style={[styles.round_pink_btn_bg, { flex: 1, height: 40, justifyContent: "center" }]}
                                        onPress={() => this.loginUser(this.state.email, this.state.password)}>
                                        <Text style={{ textAlign: "center", fontSize: 17, fontWeight: "bold", color: "#fff" }}>Login</Text>
                                    </TouchableOpacity>
                                }
                                {!this.state.isLoading && this.state.isGroupSelection &&
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        style={[styles.round_pink_btn_bg, { flex: 1, height: 40, justifyContent: "center" }]}
                                        onPress={() => this.handleUserRoles(this.state.respData)}>
                                        <Text style={{ textAlign: "center", fontSize: 17, fontWeight: "bold", color: "#fff" }}>Continue</Text>
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
            </SafeAreaView>
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
                    // this.loadUserGroups(responseJson.data)
                    // this.setState({ respData: responseJson.data, isGroupSelection: true, isLoading: false })
                    this.props.updateChatCounter(responseJson.new_message)
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

    loadUserGroups(data) {
        let groups = []
        data.groups.map((item, index) => {
            if (index == 0) {
                groups.push({
                    id: item.id, key: item.role, icon: "", type: item.id
                })
            } else if (index > 0 && groups[index - 1] && groups[index - 1].role != item.key) {
                groups.push({
                    id: item.id, key: item.role, icon: "", type: item.id
                })
            }
        })
        this.setState({ userGroups: groups, selectedGroupId: groups[0].id })
    }

    handleUserRoles(data) {
        this.setState({ isLoading: true })

        var primaryRole = ""
        var secondaryRole = ""
        var primaryGId = ""
        var secondaryGId = ""

        let gData = this.state.userGroups.find(item => item.id == this.state.selectedGroupId)
        if (gData) {
            primaryRole = gData.key
            primaryGId = gData.id
        }

        // data.groups.map((item, index) => {
        //     if (item.status == "1" && item.primary == true) {
        //         primaryRole = item.role != undefined ? item.role : ""
        //         primaryGId = item.id
        //     } else if (item.status == "1" && item.primary == false) {
        //         secondaryRole = item.role != undefined ? item.role : ""
        //         secondaryGId = item.id
        //     }
        // })

        var userData = {
            userId: data.user_id,
            userName: this.state.email,
            userPassword: this.state.password,
            email: data.email,
            picPath: data.user_image,
            userFName: data.first_name,
            userLName: data.last_name,
            userMobNo: data.cell_phone,
            primary_type: primaryRole,
            primary_gid: primaryGId,
            secondary_type: secondaryRole,
            secondary_gid: secondaryGId,
            businessId: data.outlet_id,
        }
        prefManager.createNewUserSession(userData, data.token)
        prefManager.setDummyLinesAndShiftsData(data.shifts, data.plants)
        prefManager.setFirebaseDBRoot(data.document_name)

        setTimeout(() => {
            this.navigateToHome()
        }, 2000)
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

const mapDispatchToProps = (dispatch) => {
    return {
        updateChatCounter: (counts) => dispatch({ type: 'UPDATE_CHAT_MSG_COUNTER', chat_counter: counts }),
        resetChatCounter: () => dispatch({ type: 'RESET_CHAT_MSG_COUNTER' })
    }
}
export default connect(null, mapDispatchToProps)(UserLogin)