import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView } from "react-native";
import { CheckBox, ButtonGroup, Button } from 'react-native-elements'
import Modal from "react-native-modal";
import { appPinkColor } from "../../utils/AppStyles";
import WebHandler from "../../data/remote/WebHandler"
import MyUtils from "../../utils/MyUtils";
import DateTimePicker from "react-native-modal-datetime-picker";

const webHandler = new WebHandler()
class FormNo5 extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Bulk Pasta Temp Log (Every Tub)",
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            isFormSubmitting: false,
            packingOperator: "",
            productName: "",
            itemNumber: "",
            palletNo: "",
            timeInCooler: "00:00",
            timeOutCooler: "00:00",
            temp: "",
            correctiveAction: "",
            isCorrectiveActionNeeded: false,
            isTimeInCooerVis: false,
            isTimeOutCoolerVis: false
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

    handleTimeInCoolerPicker(date) {
        this.setState({ isTimeInCooerVis: false })
        var d = new Date(date)
        this.setState({ timeInCooler: d.toLocaleTimeString() })
    }

    handleTimeOutCoolerPicker(date) {
        this.setState({ isTimeOutCoolerVis: false })
        var d = new Date(date)
        this.setState({ timeOutCooler: d.toLocaleTimeString() })
    }

    handleTempChange(temp) {
        if (!MyUtils.isEmptyString(temp)) {
            let t = parseFloat(temp)
            this.setState({ isCorrectiveActionNeeded: t > 40 })
        } else {
            this.setState({ isCorrectiveActionNeeded: false })
        }
        this.setState({ temp: temp })
    }

    render() {
        const hintColor = "#ccc"
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={styles.container}>
                    {this.renderLoadingDialog()}

                    <DateTimePicker
                        isVisible={this.state.isTimeInCooerVis}
                        mode={"time"}
                        date={new Date()}
                        onConfirm={(date) => this.handleTimeInCoolerPicker(date)}
                        onCancel={() => this.setState({ isTimeInCooerVis: false })}
                    />

                    <DateTimePicker
                        isVisible={this.state.isTimeOutCoolerVis}
                        mode={"time"}
                        date={new Date()}
                        onConfirm={(date) => this.handleTimeOutCoolerPicker(date)}
                        onCancel={() => this.setState({ isTimeOutCoolerVis: false })}
                    />

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Packing Operator: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.packingOperator}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ packingOperator: text })}
                            placeholderTextColor={hintColor} />
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Product Name: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.productName}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ productName: text })}
                            placeholderTextColor={hintColor} />
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
                        <Text>Container/Pallet # </Text>
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
                        <Text>Time In Cooler: </Text>
                        <TouchableOpacity
                            onPress={() => { this.setState({ isTimeInCooerVis: true }) }}
                        >
                            <Text style={{ padding: 5, fontSize: 16, color: "black" }}>{this.state.timeInCooler} </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Time out of cooler: </Text>
                        <TouchableOpacity
                            onPress={() => { this.setState({ isTimeOutCoolerVis: true }) }}
                        >
                            <Text style={{ padding: 5, fontSize: 16, color: "black" }}>{this.state.timeOutCooler} </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Temperature (must be at or below 40 F) </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='number-pad'
                            returnKeyType="done"
                            value={this.state.temp}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.handleTempChange(text)}
                            placeholderTextColor={hintColor} />
                    </View>

                    {this.state.isCorrectiveActionNeeded &&
                        <View style={[styles.round_white_bg_container]}>
                            <Text>Corrective Action: </Text>
                            <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType='default'
                                returnKeyType="done"
                                value={this.state.correctiveAction}
                                numberOfLines={1}
                                multiline={false}
                                placeholder='* Type here'
                                onChangeText={(text) => this.setState({ correctiveAction: text })}
                                placeholderTextColor={hintColor} />
                        </View>
                    }

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

        let v1 = this.state.packingOperator
        let v2 = this.state.productName
        let v3 = this.state.itemNumber
        let v4 = this.state.palletNo

        let v5 = this.state.timeInCooler
        let v6 = this.state.timeOutCooler

        let v7 = this.state.temp
        let v8 = this.state.correctiveAction

        if (MyUtils.isEmptyString(v1) || MyUtils.isEmptyString(v2) || MyUtils.isEmptyString(v3) || MyUtils.isEmptyString(v4) ||
            MyUtils.isEmptyString(v6) || MyUtils.isEmptyString(v7) || (this.state.isCorrectiveActionNeeded && MyUtils.isEmptyString(v8))) {
            MyUtils.showSnackbar("Please fill all required (*) fields", "")
            return;
        }

        let formData = {
            packingOperator: v1,
            productName: v2,
            itemNumber: v3,
            palletNo: v4,
            timeInCooler: v5,
            timeOutCooler: v6,
            temp: v7,
            correctiveAction: v8
        }

        this.setState({ isFormSubmitting: true })
        webHandler.submitBulkInspectionForm1(formData, (responseJson) => {
            this.setState({ isFormSubmitting: false })
            MyUtils.showSnackbar("form submitted successfully", "")
            this.props.navigation.goBack()
        }, (error) => {
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

export default FormNo5