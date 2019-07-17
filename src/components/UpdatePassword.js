
import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import { defTextInputStyle, defButtonContainer, defButtonText, appGreyColor } from '../utils/AppStyles'
import Icon from 'react-native-vector-icons/Feather';
import MyUtils from "../utils/MyUtils"
import WebHandler from "../data/remote/WebHandler"

const webHandler = new WebHandler()
class UpdatePassword extends Component {

    constructor(props) {
        super(props)
        this.state = ({
            old_password: "",
            new_password: "",
            confirm_password: "",
            isLoading: false
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={{ padding: 10, marginBottom: 5, alignSelf: "flex-end", justifyContent: "center", }}
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon name="x" size={28} color={appGreyColor} />
                    </TouchableOpacity>
                    <View style={[defTextInputStyle.inputsection, { marginBottom: 5 }]}>
                        <Icon name="lock" style={defTextInputStyle.icon} size={15} color="#797979" />
                        <TextInput style={[defTextInputStyle.input]}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="next"
                            value={this.state.old_password}
                            placeholder='* Old Password'
                            onChangeText={(text) => this.setState({ old_password: text })}
                            placeholderTextColor='#797979' />
                    </View>
                    <View style={[defTextInputStyle.inputsection, { marginBottom: 5 }]}>
                        <Icon name="lock" style={defTextInputStyle.icon} size={15} color="#797979" />
                        <TextInput style={[defTextInputStyle.input]}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="next"
                            value={this.state.new_password}
                            placeholder='* New Password'
                            onChangeText={(text) => this.setState({ new_password: text })}
                            placeholderTextColor='#797979' />
                    </View>
                    <View style={[defTextInputStyle.inputsection, { marginBottom: 5 }]}>
                        <Icon name="lock" style={defTextInputStyle.icon} size={15} color="#797979" />
                        <TextInput style={[defTextInputStyle.input]}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="next"
                            value={this.state.confirm_password}
                            placeholder='* Confirm Password'
                            onChangeText={(text) => this.setState({ confirm_password: text })}
                            placeholderTextColor='#797979' />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        {!this.state.isLoading &&
                            <TouchableOpacity activeOpacity={0.9} style={[{ width: "100%" }, defButtonContainer]}
                                onPress={() => this.updatePassword()}>
                                <Text style={defButtonText}>UPDATE PASSWORD</Text>
                            </TouchableOpacity>
                        }
                        {this.state.isLoading &&
                            <ActivityIndicator size="large" />
                        }

                    </View>
                </View>
            </SafeAreaView>
        );
    }

    updatePassword() {
        var oldPass = this.state.old_password.toString()
        var newPass = this.state.new_password.toString()
        var confirmPass = this.state.confirm_password.toString()

        if (oldPass.trim() == "" || newPass.trim() == "" || confirmPass.trim() == "") {
            MyUtils.showSnackbar("Please fill all required (*) fields", "")
        } else if (newPass != confirmPass) {
            MyUtils.showSnackbar("Password fields doesn't matched", "")
        } else {
            this.setState({ isLoading: true })
            webHandler.updatePassword(oldPass, newPass,
                (responseJson) => {
                    this.setState({ isLoading: false, old_password: "", new_password: "", confirm_password: "" })
                    MyUtils.showSnackbar("Password updated successfully", "")
                }, (error) => {
                    this.setState({ isLoading: false })
                    MyUtils.showSnackbar(error, "")
                })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 15
    },
    round_pink_btn_bg: {
        backgroundColor: '#F75473',
        overflow: 'hidden',
        borderRadius: 5
    },
    round_white_bg_container: {
        backgroundColor: '#fff',
        margin: 7,
        borderRadius: 5
    },
});

export default UpdatePassword;