import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { CheckBox, ButtonGroup, Button } from 'react-native-elements'
import Modal from "react-native-modal";
import { appPinkColor } from "../../utils/AppStyles";
import WebHandler from "../../data/remote/WebHandler"
import MyUtils from "../../utils/MyUtils";
import DateTimePicker from "react-native-modal-datetime-picker";

const webHandler = new WebHandler()

class FormNo3 extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Palletizing Record",
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            time: "00:00:00",
            itemNumber: "",
            cases: "",
            usedByDate: "0000-00-00",
            codeDate: "0000-00-00",
            initials: "",
            isTimePickerVisible: false,
            isUsedByDateVisible: false,
            isCodeDateVisible: false,
        }
    }

    renderLoadingDialog() {
        return (
            <Modal
                isVisible={this.state.isFormSubmitting}
                // onBackdropPress={() => this.setState({ modalVisible: false })}
                onBackButtonPress={() => this.setState({ isFormSubmitting: false })}
            >
                <View style={{ backgroundColor: "#fff", height: 100, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={appPinkColor} />
                    <Text>Please Wait...</Text>
                </View>
            </Modal>
        )
    }

    handleTimePicker(date) {
        this.setState({ isTimePickerVisible: false })
        var d = new Date(date)
        this.setState({ time: d.toLocaleTimeString() })
    }

    handleUsedByDatePicker(date) {
        this.setState({ isUsedByDateVisible: false })
        var d = new Date(date)
        let dt = d.getFullYear() + "-" + this.getWith0Digit((d.getMonth() + 1)) + "-" + this.getWith0Digit(d.getDay())
        this.setState({ usedByDate: dt })
    }

    handleCodeDatePicker(date) {
        this.setState({ isCodeDateVisible: false })
        var d = new Date(date)
        let dt = d.getFullYear() + "-" + this.getWith0Digit((d.getMonth() + 1)) + "-" + this.getWith0Digit(d.getDay())
        this.setState({ codeDate: dt })
    }

    getWith0Digit(num) {
        let n = parseInt(num)
        let pad = (n < 10) ? '0' : '';
        return pad + num;
    }

    render() {
        const hintColor = "#ccc"
        return (
            <ScrollView style={styles.container}>

                {this.renderLoadingDialog()}

                <DateTimePicker
                    isVisible={this.state.isTimePickerVisible}
                    mode={"time"}
                    date={new Date()}
                    onConfirm={(date) => this.handleTimePicker(date)}
                    onCancel={() => this.setState({ isCheckInTimePickerVisible: false })}
                />

                <DateTimePicker
                    isVisible={this.state.isUsedByDateVisible}
                    mode={"date"}
                    date={new Date()}
                    onConfirm={(date) => this.handleUsedByDatePicker(date)}
                    onCancel={() => this.setState({ isUsedByDateVisible: false })}
                />

                <DateTimePicker
                    isVisible={this.state.isCodeDateVisible}
                    mode={"date"}
                    date={new Date()}
                    onConfirm={(date) => this.handleCodeDatePicker(date)}
                    onCancel={() => this.setState({ isCodeDateVisible: false })}
                />

                <View style={[styles.round_white_bg_container]}>
                    <Text>Time: </Text>
                    <TouchableOpacity
                        onPress={() => { this.setState({ isTimePickerVisible: true }) }}
                    >
                        <Text style={{ padding: 5, fontSize: 16, color: "black" }}>{this.state.time} </Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Item Number: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.itemNumber}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ itemNumber: text })}
                        placeholderTextColor={hintColor} />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Cases: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.cases}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ cases: text })}
                        placeholderTextColor={hintColor} />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Used By Date: </Text>
                    <TouchableOpacity
                        onPress={() => { this.setState({ isUsedByDateVisible: true }) }}
                    >
                        <Text style={{ padding: 5, fontSize: 16, color: "black" }}>{this.state.usedByDate} </Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Code Date (ACC/Unacc): </Text>
                    <TouchableOpacity
                        onPress={() => { this.setState({ isCodeDateVisible: true }) }}
                    >
                        <Text style={{ padding: 5, fontSize: 16, color: "black" }}>{this.state.codeDate} </Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Initials: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.initials}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ initials: text })}
                        placeholderTextColor={hintColor} />
                </View>

                <View style={{ flexDirection: "row" }}>
                    <Button
                        title="Submit"
                        onPress={() => { this.submitForm() }}
                        containerStyle={{ margin: 5, flex: 1 }}
                        buttonStyle={{ backgroundColor: "green", marginEnd: 5 }}
                    />

                    <Button
                        title="Cancel"
                        onPress={() => { this.props.navigation.goBack() }}
                        containerStyle={{ margin: 5, flex: 1 }}
                        buttonStyle={{ backgroundColor: "red", marginEnd: 5 }}
                    />
                </View>

            </ScrollView>
        )
    }

    submitForm() {
        this.setState({ isFormSubmitting: true })
        let formData = {
            time: this.state.time,
            itemNumber: this.state.itemNumber,
            cases: this.state.cases,
            usedByDate: this.state.usedByDate,
            codeDate: this.state.codeDate,
            initials: this.state.initials
        }
        webHandler.submitpalletizingInspectionForm(formData, (responseJson) => {
            this.setState({ isFormSubmitting: false })
            this.props.navigation.goBack()
        }, error => {
            MyUtils.showSnackbar(error, "")
            this.setState({ isFormSubmitting: false })
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    round_white_bg_container: {
        backgroundColor: '#fff',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        padding: 5,
        borderRadius: 5
    },

});

export default FormNo3