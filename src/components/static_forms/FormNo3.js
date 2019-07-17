import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView } from "react-native";
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
            palletNo: "",
            time: "00:00:00",
            itemNumber: "",
            cases: "",
            usedByDate: "MM-DD-YYYY",
            codeDate: "MM-DD-YYYY",
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
        let dt = MyUtils.getWith0Digit((d.getMonth() + 1)) + "-" + MyUtils.getWith0Digit(d.getDate()) + "-" + d.getFullYear()
        this.setState({ usedByDate: dt })
    }

    handleCodeDatePicker(date) {
        this.setState({ isCodeDateVisible: false })
        var d = new Date(date)
        let dt = MyUtils.getWith0Digit((d.getMonth() + 1)) + "-" + MyUtils.getWith0Digit(d.getDate()) + "-" + d.getFullYear()
        this.setState({ codeDate: dt })
    }

    render() {
        const hintColor = "#ccc"
        return (
            <SafeAreaView style={{ flex: 1 }}>
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
                        <Text>Pallet No: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.palletNo}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ palletNo: text })}
                            placeholderTextColor={hintColor} />
                    </View>

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

                    {/* <View style={[styles.round_white_bg_container]}>
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
                </View> */}

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
            </SafeAreaView>
        )
    }

    submitForm() {
        let v0 = this.state.palletNo
        let v1 = this.state.time
        let v2 = this.state.itemNumber
        let v3 = this.state.cases
        let v4 = this.state.usedByDate
        let v5 = this.state.codeDate
        // let v6 = this.state.initials

        if (MyUtils.isEmptyString(v0) || MyUtils.isEmptyString(v1) || MyUtils.isEmptyString(v2) || MyUtils.isEmptyString(v3) ||
            MyUtils.isEmptyString(v4) || MyUtils.isEmptyString(v5)) {
            MyUtils.showSnackbar("Please fill all required (*) fields", "")
            return;
        }

        let formData = {
            palletNo: v0,
            time: v1,
            itemNumber: v2,
            cases: v3,
            usedByDate: v4,
            codeDate: v5,
            // initials: v6
        }

        this.setState({ isFormSubmitting: true })
        webHandler.submitpalletizingInspectionForm(formData, (responseJson) => {
            this.setState({ isFormSubmitting: false })
            MyUtils.showSnackbar("form submitted successfully", "")
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