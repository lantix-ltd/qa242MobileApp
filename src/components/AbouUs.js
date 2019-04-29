<<<<<<< HEAD

import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { appGreyColor } from "../utils/AppStyles";

class AboutUs extends Component {

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={{ padding: 10, marginBottom: 5, alignSelf: "flex-end", justifyContent: "center", }}
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon name="x" size={28} color={appGreyColor} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
});

=======

import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { appGreyColor } from "../utils/AppStyles";

class AboutUs extends Component {

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={{ padding: 10, marginBottom: 5, alignSelf: "flex-end", justifyContent: "center", }}
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon name="x" size={28} color={appGreyColor} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
});

>>>>>>> b6a1ebb00a45edb093387e51e55ebc3e6914a0d7
export default AboutUs;