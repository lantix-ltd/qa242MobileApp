import React from "react";
import { ToastAndroid, ActivityIndicator, Text, View, TouchableOpacity } from "react-native"
import { appPinkColor, defButtonContainer, defButtonText } from "./AppStyles";
import { Button } from "react-native-elements"

export default {

    APP_NAME: "cQcheck",

    isEmptyArray(array) {
        if (array == undefined || array == null || array == "" || array.length == 0) {
            return true
        } else {
            return false
        }
    },

    showSnackbar(message, color) {
        // Snackbarr.show({
        //     title: message,
        //     duration: Snackbarr.LENGTH_LONG,
        //     backgroundColor: color,
        //     action: {
        //         title: 'Ok',
        //         color: 'white',
        //     },
        // });
        ToastAndroid.show(message, ToastAndroid.SHORT)
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