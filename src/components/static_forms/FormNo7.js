import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView } from "react-native";
import { CheckBox, ButtonGroup, Button } from 'react-native-elements'
import Modal from "react-native-modal";
import { appPinkColor } from "../../utils/AppStyles";
import WebHandler from "../../data/remote/WebHandler"
import MyUtils from "../../utils/MyUtils";
import DateTimePicker from "react-native-modal-datetime-picker";

const allergenContent = ["E", "M", "S", "WH", "F", "SF", "TN", "N/A"]
const webHandler = new WebHandler()
class FormNo7 extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Bulk Pasta Temp Log (Every Bulk Form)",
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            isFormSubmitting: false,
            item: "",
            date: "MM-DD-YYYY",
            lotCode: "",
            expDate: "MM-DD-YYYY",
            time: "00:00",
            allergen: 0,
            qty: "",
            palletNo: "",
            isDatePickerVis: false,
            isExpDatePickerVis: false,
            isTimePickerVis: false
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
        this.setState({ isTimePickerVis: false })
        var d = new Date(date)
        this.setState({ time: d.toLocaleTimeString() })
    }

    handleDatePicker(date) {
        this.setState({ isDatePickerVis: false })
        var d = new Date(date)
        let dt = MyUtils.getWith0Digit((d.getMonth() + 1)) + "-" + MyUtils.getWith0Digit(d.getDate()) + "-" + d.getFullYear()
        this.setState({ date: dt })
    }

    handleExpDatePicker(date) {
        this.setState({ isExpDatePickerVis: false })
        var d = new Date(date)
        let dt = MyUtils.getWith0Digit((d.getMonth() + 1)) + "-" + MyUtils.getWith0Digit(d.getDate()) + "-" + d.getFullYear()
        this.setState({ expDate: dt })
    }

    render() {
        const hintColor = "#ccc"
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={styles.container}>
                    {this.renderLoadingDialog()}

                    <DateTimePicker
                        isVisible={this.state.isTimePickerVis}
                        mode={"time"}
                        date={new Date()}
                        onConfirm={(date) => this.handleTimePicker(date)}
                        onCancel={() => this.setState({ isTimePickerVis: false })}
                    />

                    <DateTimePicker
                        isVisible={this.state.isDatePickerVis}
                        mode={"date"}
                        date={new Date()}
                        onConfirm={(date) => this.handleDatePicker(date)}
                        onCancel={() => this.setState({ isDatePickerVis: false })}
                    />

                    <DateTimePicker
                        isVisible={this.state.isExpDatePickerVis}
                        mode={"date"}
                        date={new Date()}
                        onConfirm={(date) => this.handleExpDatePicker(date)}
                        onCancel={() => this.setState({ isExpDatePickerVis: false })}
                    />

                    <View style={[styles.round_white_bg_container]}>

                        <Text style={{ color: "#000", fontSize: 20, marginBottom: 10 }}>Trace Label Information:</Text>

                        <View style={[styles.round_white_bg_container]}>
                            <Text>Item: </Text>
                            <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType='default'
                                returnKeyType="done"
                                value={this.state.item}
                                numberOfLines={1}
                                multiline={false}
                                placeholder='* Type here'
                                onChangeText={(text) => this.setState({ item: text })}
                                placeholderTextColor={hintColor} />
                        </View>

                        <View style={[styles.round_white_bg_container]}>
                            <Text>Date: </Text>
                            <TouchableOpacity
                                onPress={() => { this.setState({ isDatePickerVis: true }) }}
                            >
                                <Text style={{ padding: 5, fontSize: 16, color: "black" }}>{this.state.date} </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.round_white_bg_container]}>
                            <Text>Lot Code: </Text>
                            <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType='default'
                                returnKeyType="done"
                                value={this.state.lotCode}
                                numberOfLines={1}
                                multiline={false}
                                placeholder='* Type here'
                                onChangeText={(text) => this.setState({ lotCode: text })}
                                placeholderTextColor={hintColor} />
                        </View>

                        <View style={[styles.round_white_bg_container]}>
                            <Text>Exp Date: </Text>
                            <TouchableOpacity
                                onPress={() => { this.setState({ isExpDatePickerVis: true }) }}
                            >
                                <Text style={{ padding: 5, fontSize: 16, color: "black" }}>{this.state.expDate} </Text>
                            </TouchableOpacity>
                        </View>


                        <View style={[styles.round_white_bg_container]}>
                            <Text>Time: </Text>
                            <TouchableOpacity
                                onPress={() => { this.setState({ isTimePickerVis: true }) }}
                            >
                                <Text style={{ padding: 5, fontSize: 16, color: "black" }}>{this.state.time} </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.round_white_bg_container]}>
                            <Text>Allergen </Text>
                            <ButtonGroup
                                selectedIndex={this.state.allergen}
                                onPress={(index) => this.setState({ allergen: index })}
                                buttons={allergenContent}
                                containerStyle={{ height: 50 }}
                            />
                        </View>

                        <View style={[styles.round_white_bg_container]}>
                            <Text>QTY: </Text>
                            <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType='default'
                                returnKeyType="done"
                                value={this.state.qty}
                                numberOfLines={1}
                                multiline={false}
                                placeholder='* Type here'
                                onChangeText={(text) => this.setState({ qty: text })}
                                placeholderTextColor={hintColor} />
                        </View>

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
            </SafeAreaView>
        )
    }

    submitForm() {
        let v1 = this.state.item
        let v2 = this.state.date
        let v3 = this.state.lotCode
        let v4 = this.state.expDate
        let v5 = this.state.time
        let v6 = allergenContent[this.state.allergen]
        let v7 = this.state.qty
        let v8 = this.state.palletNo

        if (MyUtils.isEmptyString(v1) || MyUtils.isEmptyString(v3) || MyUtils.isEmptyString(v7) || MyUtils.isEmptyString(v8)) {
            MyUtils.showSnackbar("Please fill all required (*) fields", "")
            return;
        }

        let formData = {
            item: v1,
            date: v2,
            lotCode: v3,
            expDate: v4,
            time: v5,
            allergen: v6,
            qty: v7,
            palletNo: v8
        }

        this.setState({ isFormSubmitting: true })
        webHandler.submitBulkInspectionForm2(formData, (responseJson) => {
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

export default FormNo7