
import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, ToastAndroid, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { appGreyColor } from "../utils/AppStyles";
import LinesAndShiftForm from "../utils/LinesAndShiftForm"

class LinesAndShiftScreen extends Component {

    componentDidMount() {
        this.props.navigation.addListener('willFocus', (playload) => {
            this.refs._linesAndShiftForm.loadData()
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={{ padding: 10, marginBottom: 5, alignSelf: "flex-end", justifyContent: "center", }}
                    onPress={() => this.props.navigation.goBack()}>
                    <Icon name="x" size={28} color={appGreyColor} />
                </TouchableOpacity>
                <View style={{ flex: 1, }}>
                    <LinesAndShiftForm
                        ref="_linesAndShiftForm"
                        onSavePress={() => this.props.navigation.goBack()}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    }
});

export default LinesAndShiftScreen;