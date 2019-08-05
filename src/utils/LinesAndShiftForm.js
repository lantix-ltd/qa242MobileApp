import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import PrefManager from "../data/local/PrefManager"
import { defButtonContainer, defButtonText, appGreyColor, primaryColor, } from "./AppStyles";
import { CheckBox, ButtonGroup } from 'react-native-elements'
import MyUtils from "./MyUtils";

const prefManager = new PrefManager()
class LinesAndShift extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedShiftIndex: -1,
            selectedPlantIndex: -1,
            isLineNA: false,
            isShiftNA: false,
            isPlantNA: false,
            isLineCheckExist: false,
            isShiftCheckExist: false,

            linesData: [],
            shiftsData: [],
            plantsData: [],

            plantsWithLines: []
        }
    }

    componentDidMount() {
        prefManager.getDummyLinesAndShiftsData((shifts, plantsWithLines) => {
            let ShiftsD = [], PlantsD = []

            plantsWithLines.map(item => {
                PlantsD.push({ id: item.plant_id, val: item.plant_name })
            })

            shifts.map(item => {
                ShiftsD.push({ id: item.shift_id, val: item.shift_name })
            })

            this.setState({
                plantsWithLines: plantsWithLines, shiftsData: ShiftsD, plantsData: PlantsD,
            })

            this.loadData()
        })
    }

    loadData() {
        prefManager.getPlantCheckData((isPlantNA, selectedIndx, selecetedVal) => {
            this.setState({
                isPlantNA: isPlantNA,
                selectedPlantIndex: selectedIndx
            })
        })

        prefManager.getLineCheckData((isLineNA, linesData) => {
            if (!MyUtils.isEmptyArray(linesData)) {
                this.setState({
                    isLineNA: isLineNA,
                    linesData: linesData
                })
            }
        })

        prefManager.getShiftCheckData((isShiftNA, selectedIndx, selecetedVal) => {
            this.setState({
                isShiftNA: isShiftNA,
                selectedShiftIndex: selectedIndx
            })
        })
    }

    render() {
        const shifts = [], plants = []
        this.state.plantsData.map((item) => {
            plants.push(item.val)
        })
        this.state.shiftsData.map((item) => {
            shifts.push(item.val)
        })
        return (
            <ScrollView style={styles.container}>
                <View>

                    <View style={styles.round_white_bg_container}>
                        <Text style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: "#000" }}> * Which plants you're working on? </Text>
                        <View>
                            {!this.state.isPlantNA &&
                                <ButtonGroup
                                    onPress={(index) => this.handlePlantChange(index)}
                                    selectedIndex={this.state.selectedPlantIndex}
                                    buttons={plants}
                                    selectedButtonStyle={{ backgroundColor: primaryColor }}
                                    containerStyle={{ height: 50 }}
                                />
                            }
                        </View>
                        <CheckBox
                            title='Not Applicable'
                            textStyle={{ color: primaryColor }}
                            checkedColor={primaryColor}
                            containerStyle={{ alignSelf: "center" }}
                            checked={this.state.isPlantNA}
                            onPress={() => { this.setState({ isPlantNA: !this.state.isPlantNA }) }}
                        />
                    </View>

                    {(this.state.selectedPlantIndex > -1 && !this.state.isPlantNA) &&
                        <View style={[styles.round_white_bg_container, { alignItems: "flex-start" }]} >
                            <Text
                                style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: "#000" }}>
                                * Which lines you're working on? </Text>
                            {!this.state.isLineNA &&
                                <View
                                    pointerEvents={this.state.isLineNA ? "none" : "auto"}
                                    style={{ flexDirection: "row" }}>
                                    {
                                        this.state.linesData.map((item, index) => {
                                            return (
                                                <CheckBox
                                                    key={index}
                                                    containerStyle={{ flex: 1 }}
                                                    title={"Line " + item.val}
                                                    textStyle={{ fontSize: 12, color: appGreyColor }}
                                                    checked={item.isChecked}
                                                    checkedColor={primaryColor}
                                                    onPress={() => { this.handleLineChange(item) }}
                                                />
                                            )
                                        })
                                    }
                                </View>
                            }
                            <CheckBox
                                title='Not Applicable'
                                containerStyle={{ alignSelf: "center" }}
                                checked={this.state.isLineNA}
                                textStyle={{ color: primaryColor }}
                                checkedColor={primaryColor}
                                onPress={() => { this.setState({ isLineNA: !this.state.isLineNA }) }}
                            />
                        </View>
                    }

                    <View style={[styles.round_white_bg_container, { alignItems: "flex-start", }]}>
                        <Text style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: "#000" }}> * Which shift you're working on? </Text>
                        {!this.state.isShiftNA &&
                            <ButtonGroup
                                onPress={(index) => this.setState({ selectedShiftIndex: index })}
                                selectedIndex={this.state.selectedShiftIndex}
                                buttons={shifts}
                                selectedButtonStyle={{ backgroundColor: primaryColor }}
                                containerStyle={{ height: 50 }}
                            />
                        }
                        <CheckBox
                            title='Not Applicable'
                            textStyle={{ color: primaryColor }}
                            checkedColor={primaryColor}
                            containerStyle={{ alignSelf: "center" }}
                            checked={this.state.isShiftNA}
                            onPress={() => { this.handleShiftNACheck(!this.state.isShiftNA) }}
                        />
                    </View>

                    <View style={{ flex: 1 }} />

                    <TouchableOpacity activeOpacity={0.9}
                        style={[styles.round_pink_btn_bg, {
                            marginTop: 10,
                            padding: 10,
                            width: "90%", justifyContent: "center",
                            alignSelf: "center"
                        }]}
                        onPress={() => { this.handleSaveAction() }}>
                        <Text style={defButtonText}>SAVE</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        );
    }

    handleShiftNACheck(isNA) {
        this.setState({ isShiftNA: isNA })
        if (isNA) {
            this.setState({ selectedShiftIndex: -1 })
        } else {
            this.setState({ selectedShiftIndex: 0 })
        }
    }

    handleLineChange(item) {
        let _LD = this.state.linesData
        let isChecked_old = item.isChecked

        let indx = _LD.findIndex(opt => opt.id == item.id)
        let mod_item = { id: item.id, val: item.val, isChecked: !isChecked_old }

        _LD[indx] = mod_item

        this.setState({ linesData: _LD })
    }

    handlePlantChange(index) {
        let selecetedPlantItem = this.state.plantsWithLines[index]

        var lines = []
        selecetedPlantItem.lines.map(item => {
            lines.push({ id: item.line_id, val: item.line_name, isChecked: false })
        })

        this.setState({ selectedPlantIndex: index, linesData: lines })
    }

    handleSaveAction() {
        let plantVal = ""
        if (!MyUtils.isEmptyArray(this.state.plantsData) && this.state.selectedPlantIndex > -1) {
            plantVal = this.state.plantsData[this.state.selectedPlantIndex].val
        }
        prefManager.setPlantCheckData(
            this.state.isPlantNA,
            this.state.selectedPlantIndex,
            plantVal
        )

        prefManager.setLineCheckData(
            this.state.isLineNA,
            JSON.stringify(this.state.linesData),
        )

        let shiftVal = ""
        if (!MyUtils.isEmptyArray(this.state.shiftsData) && this.state.selectedShiftIndex > -1) {
            shiftVal = this.state.shiftsData[this.state.selectedShiftIndex].val
        }
        prefManager.setShiftCheckData(
            this.state.isShiftNA,
            this.state.selectedShiftIndex,
            shiftVal
        )

        if (this.props.onSavePress != undefined) {
            this.props.onSavePress()
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    round_white_bg_container: {
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 8
    },
    round_pink_btn_bg: {
        backgroundColor: '#F75473',
        overflow: 'hidden',
        borderRadius: 5
    }
});

export default LinesAndShift;