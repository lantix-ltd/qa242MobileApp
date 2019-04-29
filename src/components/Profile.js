
import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import { defTextInputStyle, defButtonContainer, defButtonText, appGreyColor } from '../utils/AppStyles'
import Icon from 'react-native-vector-icons/Feather';
import MyUtils from "../utils/MyUtils"
import PrefManager from "../data/local/PrefManager"
import WebHandler from "../data/remote/WebHandler"

const webHandler = new WebHandler()
const prefManager = new PrefManager()
class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = ({
            first_name: "",
            last_name: "",
            contact_no: "",
            email: "",
            isLoading: false
        })
    }

    componentDidMount() {
        prefManager.getUserProfileData(result => {
            if (result != null) {
                this.setState({
                    first_name: result.fname,
                    last_name: result.lname,
                    email: result.email,
                    contact_no: result.mobileNo
                })
            }
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
                        <Icon name="user" style={defTextInputStyle.icon} size={15} color="#797979" />
                        <TextInput style={[defTextInputStyle.input]}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="next"
                            value={this.state.first_name}
                            placeholder='* First Name'
                            onChangeText={(text) => this.setState({ first_name: text })}
                            placeholderTextColor='#797979' />
                    </View>
                    <View style={[defTextInputStyle.inputsection, { marginBottom: 5 }]}>
                        <Icon name="user" style={defTextInputStyle.icon} size={15} color="#797979" />
                        <TextInput style={[defTextInputStyle.input]}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="next"
                            value={this.state.last_name}
                            placeholder='* Last Name'
                            onChangeText={(text) => this.setState({ last_name: text })}
                            placeholderTextColor='#797979' />
                    </View>
                    <View style={[defTextInputStyle.inputsection, { marginBottom: 5 }]}>
                        <Icon name="phone" style={defTextInputStyle.icon} size={15} color="#797979" />
                        <TextInput style={[defTextInputStyle.input]}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='number-pad'
                            returnKeyType="next"
                            value={this.state.contact_no}
                            placeholder='* Contact No.'
                            onChangeText={(text) => this.setState({ contact_no: text })}
                            placeholderTextColor='#797979' />
                    </View>
                    <View style={[defTextInputStyle.inputsection, { marginBottom: 5 }]}>
                        <Icon name="mail" style={defTextInputStyle.icon} size={15} color="#797979" />
                        <TextInput style={[defTextInputStyle.input]}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='email-address'
                            returnKeyType="next"
                            value={this.state.email}
                            editable={false}
                            placeholder='* Email'
                            onChangeText={(text) => this.setState({ email: text })}
                            placeholderTextColor='#797979' />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        {!this.state.isLoading &&
                            <TouchableOpacity activeOpacity={0.9} style={[{ width: "100%" }, defButtonContainer]}
                                onPress={() => this.updateInfo()}>
                                <Text style={defButtonText}>UPDATE INFO</Text>
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

    updateInfo() {
        var fname = this.state.first_name.toString()
        var lname = this.state.last_name.toString()
        var mobNo = this.state.contact_no.toString()
        if (fname.trim() != "" && lname.trim() != "" && mobNo.trim() != "") {
            this.setState({ isLoading: true })
            webHandler.updateUserInfo(fname, lname, mobNo,
                (responseJson) => {
                    prefManager.updateUserProfileInfo(fname, lname, mobNo)
                    this.setState({ isLoading: false })
                    MyUtils.showSnackbar("Profile updated successfully!", "")
                }, error => {
                    this.setState({ isLoading: false })
                    MyUtils.showSnackbar(error, "")
                })
        } else {
            MyUtils.showSnackbar("Please fill all required (*) fields", "")
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 15
    }
});

export default Profile;