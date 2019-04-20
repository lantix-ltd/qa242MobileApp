
import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { appGreyColor } from "../utils/AppStyles";

class AboutUs extends Component {

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={{ padding: 10, marginBottom: 5, alignSelf: "flex-end", justifyContent: "center", }}
                    onPress={() => this.props.navigation.goBack()}>
                    <Icon name="x" size={28} color={appGreyColor} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
});

export default AboutUs;