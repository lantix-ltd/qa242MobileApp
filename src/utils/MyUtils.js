import React from "react";
import { ToastAndroid, ActivityIndicator, Text, View, TouchableOpacity, Platform, Alert } from "react-native"
import { appPinkColor, defButtonContainer, defButtonText } from "./AppStyles";
import { Button } from "react-native-elements"

export default {

    APP_NAME: "LANTIX eQCheck",

    isEmptyString(txt) {
        return (txt == undefined || txt == null || txt.trim() == "" || txt.length == 0)
    },

    isEmptyArray(array) {
        if (array == undefined || array == null || array == "" || array.length == 0) {
            return true
        } else {
            return false
        }
    },

     getWith0Digit(num) {
        let n = parseInt(num)
        let pad = (n < 10) ? '0' : '';
        return pad + num;
    },

    showCustomAlert(title, message) {
        Alert.alert(title, message,
            [
                {
                    text: 'OK', onPress: () => { }
                }
            ]
        )
    },

    showSnackbar(message, color) {
        // Snackbar.show({
        //     title: message,
        //     duration: Snackbar.LENGTH_LONG,
        //     backgroundColor: "#000",
        //     action: {
        //         title: 'Ok',
        //         color: 'white',
        //     },
        // });

        if (Platform.OS == "android") {
            ToastAndroid.show(message, ToastAndroid.SHORT)
        } else {
            alert(message)
        }
    },

    renderLoadingView() {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color={appPinkColor} />
            </View>
        )
    },

    renderErrorView(msg, onAction) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 16, padding: 10, textAlign: "center" }}>{msg}</Text>
                <TouchableOpacity activeOpacity={0.9} style={[{ width: "40%" }, defButtonContainer]}
                    onPress={() => onAction()}>
                    <Text style={defButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }
}