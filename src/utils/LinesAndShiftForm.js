import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import PrefManager from "../data/local/PrefManager"
import { defButtonContainer, defButtonText, appGreyColor, primaryColor, } from "./AppStyles";
import { CheckBox, ButtonGroup } from 'react-native-elements'

const prefManager = new PrefManager()
class LinesAndShift extends Component {

    constructor(props) {
        super(props)
        this.state = {
            line1Checked: false,
            line2Checked: false,
            line3Checked: false,
            selectedShiftIndex: 0,
            isLineNA: false,
            isShiftNA: false,
            isLineCheckExist: false,
            isShiftCheckExist: false,
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        prefManager.getLineCheckData((isLineNA, isLine1, isLine2, isLine3) => {
            this.setState({
                isLineNA: isLineNA,
                line1Checked: isLine1,
                line2Checked: isLine2,
                line3Checked: isLine3
            })
        })

        prefManager.getShiftCheckData((isShiftNA, val) => {
            this.setState({
                isShiftNA: isShiftNA,
                selectedShiftIndex: val
            })
        })
    }

    render() {
        const shifts = ['Morning', 'Evening']
        return (
            <View style={styles.container}>
                <View style={{ alignItems: "flex-start", marginTop: 5 }}>
                    <Text
                        style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: "#000" }}>
                        * Which lines you're working on? </Text>
                    {!this.state.isLineNA &&
                        <View
                            pointerEvents={this.state.isLineNA ? "none" : "auto"}
                            style={{ flexDirection: "row", }}>
                            <CheckBox
                                containerStyle={{ flex: 1 }}
                                title='Line 1'
                                textStyle={{ fontSize: 12, color: appGreyColor }}
                                checked={this.state.line1Checked}
                                onPress={() => { this.handleLine1Check(!this.state.line1Checked) }}
                            />
                            <CheckBox
                                containerStyle={{ flex: 1 }}
                                title='Line 2'
                                textStyle={{ fontSize: 12, color: appGreyColor }}
                                checked={this.state.line2Checked}
                                onPress={() => { this.handleLine2Check(!this.state.line2Checked) }}
                            />
                            <CheckBox
                                containerStyle={{ flex: 1 }}
                                title='Line 3'
                                textStyle={{ fontSize: 12, color: appGreyColor }}
                                checked={this.state.line3Checked}
                                onPress={() => { this.handleLine3Check(!this.state.line3Checked) }}
                            />
                        </View>
                    }
                    <CheckBox
                        title='Not Applicable'
                        containerStyle={{ alignSelf: "center" }}
                        checked={this.state.isLineNA}
                        textStyle={{ color: "red" }}
                        checkedColor="red"
                        onPress={() => { this.handleLineNACheck(!this.state.isLineNA) }}
                    />
                </View>

                <View style={{ alignItems: "flex-start", }}>
                    <Text style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: "#000" }}> * Which shift you're working on? </Text>
                    {!this.state.isShiftNA &&
                        <ButtonGroup
                            onPress={(index) => this.handleShiftChange(index)}
                            selectedIndex={this.state.selectedShiftIndex}
                            buttons={shifts}
                            containerStyle={{ height: 50 }}
                        />
                    }
                    <CheckBox
                        title='Not Applicable'
                        checkedColor="red"
                        textStyle={{ color: "red" }}
                        containerStyle={{ alignSelf: "center" }}
                        checked={this.state.isShiftNA}
                        onPress={() => { this.handleShiftNACheck(!this.state.isShiftNA) }}
                    />
                </View>

                <TouchableOpacity activeOpacity={0.9}
                    style={[defButtonContainer, {
                        margin: 10,
                        width: "90%", justifyContent: "center",
                        alignSelf: "center"
                    }]}
                    onPress={() => { this.handleSaveAction() }}>
                    <Text style={defButtonText}>SAVE</Text>
                </TouchableOpacity>

            </View>
        );
    }

    handleShiftNACheck(isNA) {
        this.setState({ isShiftNA: isNA })
        if (isNA) {
            this.setState({ selectedShiftIndex: -1 })
            // prefManager.setShiftCheckData(true, -1)
        } else {
            this.setState({ selectedShiftIndex: 0 })
            // prefManager.setShiftCheckData(false, 0)
        }
    }

    handleShiftChange(val) {
        this.setState({ selectedShiftIndex: val })
        // prefManager.setShiftCheckData(false, val)
    }

    handleLineNACheck(isNA) {
        this.setState({ isLineNA: isNA })
        if (isNA) {
            this.setState({
                line1Checked: false,
                line2Checked: false,
                line3Checked: false,
            })
            // prefManager.setLineCheckData(true, false, false, false)
        } else {
            // prefManager.setLineCheckData(false, false, false, false)
        }
    }

    handleLine1Check(val) {
        this.setState({ line1Checked: val })
        // prefManager.setLineCheckData(false, val, this.state.line2Checked, this.state.line3Checked)
    }

    handleLine2Check(val) {
        this.setState({ line2Checked: val })
        // prefManager.setLineCheckData(false, this.state.line1Checked, val, this.state.line3Checked)
    }

    handleLine3Check(val) {
        this.setState({ line3Checked: val })
        // prefManager.setLineCheckData(false, this.state.line1Checked, this.state.line2Checked, val)
    }

    handleSaveAction() {
        prefManager.setLineCheckData(
            this.state.isLineNA,
            this.state.line1Checked,
            this.state.line2Checked,
            this.state.line3Checked
        )

        prefManager.setShiftCheckData(
            this.state.isShiftNA,
            this.state.selectedShiftIndex
        )

        if (this.props.onSavePress != undefined) {
            this.props.onSavePress()
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});

export default LinesAndShift;