import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import PrefManager from "../data/local/PrefManager"
import { defButtonContainer, defButtonText, appGreyColor, primaryColor, appPinkColor, } from "./AppStyles";
import { CheckBox, ButtonGroup } from 'react-native-elements'
import MyUtils from "./MyUtils";
import WebHandler from '../data/remote/WebHandler'
import { RadioButton, Chip } from "react-native-paper"

const webHandler = new WebHandler()
const lineStatusOpts = ['Active', 'Down']
const prefManager = new PrefManager()
class LinesAndShift extends Component {

    constructor(props) {
        super(props)
        this.state = {

            isSettingsView: false,

            selectedShiftIndex: -1,
            selectedPlantIndex: -1,
            selectedLineIndex: -1,
            selectedLineStatusIndex: 0,

            isLineNA: false,
            isShiftNA: false,
            isPlantNA: false,
            isLineStatusNA: false,

            linesData: [],
            shiftsData: [],
            plantsData: [],

            plantsWithLines: [],
            productsData: [],

            selectedProductId: -1,
            isProductsLoading: false,

            userRole: ""
        }
    }

    componentDidMount() {

        this.setState({ isSettingsView: this.props.isSettingsView })

        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.setState({ userRole: userData.userPrimaryType })
            }
        })

        prefManager.getDummyLineProductsData((products) => {
            if (products != undefined && products != null) {
                this.setState({ productsData: products })
            }
        })

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
        prefManager.getShiftCheckData((isShiftNA, selectedIndx, selecetedId) => {
            this.setState({
                isShiftNA: isShiftNA,
                selectedShiftIndex: selectedIndx
            })
        })

        prefManager.getPlantCheckData((isPlantNA, selectedIndx, selecetedId) => {
            if (selectedIndx != undefined && selectedIndx != null) {
                this.setState({
                    isPlantNA: isPlantNA,
                    selectedPlantIndex: selectedIndx
                })
            }
            this.handlePlantChange(selectedIndx)
        })

        // prefManager.getLineCheckData((isLineNA, linesData) => {
        //     if (!MyUtils.isEmptyArray(linesData)) {
        //         this.setState({
        //             isLineNA: isLineNA,
        //             linesData: linesData
        //         })
        //     }
        // })

        prefManager.getLineCheckData((isLineNA, selectedIndx, selecetedId) => {
            this.setState({
                isLineNA: isLineNA,
                selectedLineIndex: selectedIndx
            })

            // prefManager.getLineStatusData((isLineStatusNA, selectedLSIndx, selecetedLSId) => {
            //     this.setState({
            //         isLineStatusNA: isLineStatusNA,
            //         selectedLineStatusIndex: selectedLSIndx
            //     })
            // })

            prefManager.getLineProductData((isLineProductNA, selectedLPIndx, selecetedLPId) => {
                let pId = (selecetedLPId == undefined || selecetedLPId == null) ? 0 : selecetedLPId
                this.setState({ selectedProductId: pId })
            })
        })
    }

    render() {
        const shifts = [], plants = [], mlines = []
        this.state.plantsData.map((item) => {
            plants.push(item.val)
        })
        this.state.shiftsData.map((item) => {
            shifts.push(item.val)
        })
        this.state.linesData.map((item) => {
            mlines.push(item.val)
        })
        return (
            <ScrollView style={styles.container}>
                <View>

                    {/* <SelectOptionModal
                        ref="_selectPhotoOptModal"
                        onItemPress={(type) => { this.handleProductChange(type) }}
                    /> */}

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

                    {(this.state.selectedPlantIndex != undefined && this.state.selectedPlantIndex > -1 && !this.state.isPlantNA) &&
                        <View style={[styles.round_white_bg_container, { alignItems: "flex-start" }]} >
                            <Text
                                style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: "#000" }}>
                                * Which lines you're working on? </Text>
                            {!this.state.isLineNA &&
                                <ButtonGroup
                                    onPress={(index) => { this.handleLineChange(index) }}
                                    selectedIndex={this.state.selectedLineIndex}
                                    buttons={mlines}
                                    selectedButtonStyle={{ backgroundColor: primaryColor }}
                                    containerStyle={{ height: 50 }}
                                />
                                // <View
                                //     pointerEvents={this.state.isLineNA ? "none" : "auto"} style={{ flex: 1 }}>
                                //     {
                                //         this.state.linesData.map((item, index) => {
                                //             return (
                                //                 <CheckBox
                                //                     key={index}
                                //                     containerStyle={{ flex: 1 }}
                                //                     title={"Line " + item.val}
                                //                     textStyle={{ fontSize: 12, color: appGreyColor }}
                                //                     checked={item.isChecked}
                                //                     checkedColor={primaryColor}
                                //                     onPress={() => { this.handleLineChange(item) }}
                                //                 />
                                //             )
                                //         })
                                //     }
                                // </View>
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

                    {/* {this.state.userRole != prefManager.EDITOR && this.state.userRole != prefManager.ADMIN &&
                        this.state.selectedLineIndex > -1 && this.renderLineStatusView()} */}

                    {this.state.userRole != prefManager.EDITOR && this.state.userRole != prefManager.ADMIN &&
                        this.state.isProductsLoading && MyUtils.renderLoadingView()}

                    {this.state.userRole != prefManager.EDITOR && this.state.userRole != prefManager.ADMIN &&
                        !this.state.isProductsLoading && !MyUtils.isEmptyArray(this.state.productsData) &&
                        !this.state.isPlantNA && !this.state.isLineNA && this.state.selectedProductId > -1 &&
                        this.renderLineProducts()
                    }

                    <View style={{ flex: 1 }} />

                    <TouchableOpacity activeOpacity={0.9}
                        style={[styles.round_pink_btn_bg, {
                            marginTop: 10,
                            marginBottom: 10,
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

    renderLineStatusView() {
        return (
            <View style={styles.round_white_bg_container}>
                <Text style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: "#000" }}> * What is the line status? </Text>
                {!this.state.isLineStatusNA &&
                    <ButtonGroup
                        onPress={(index) => this.setState({ selectedLineStatusIndex: index })}
                        selectedIndex={this.state.selectedLineStatusIndex}
                        buttons={lineStatusOpts}
                        selectedButtonStyle={{ backgroundColor: primaryColor }}
                        containerStyle={{ height: 50 }}
                    />
                }
                <CheckBox
                    title='Not Applicable'
                    containerStyle={{ alignSelf: "center" }}
                    checked={this.state.isLineStatusNA}
                    textStyle={{ color: primaryColor }}
                    checkedColor={primaryColor}
                    onPress={() => { this.setState({ isLineStatusNA: !this.state.isLineStatusNA }) }}
                />
            </View>
        )
    }

    renderLineProducts() {
        return (
            <View style={[styles.round_white_bg_container, { marginTop: 10 }]}>
                <Text style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: "#000" }}> * Which product is running? </Text>
                <RadioButton.Group
                    onValueChange={value => this.setState({ selectedProductId: value })}
                    value={this.state.selectedProductId}
                >
                    {this.state.productsData.map((item, index) => {
                        return (
                            <View key={index}
                                style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "flex-start" }}>
                                <RadioButton color={appPinkColor} value={item.id} />
                                <Text>{item.key}</Text>
                            </View>
                        )
                    })}
                </RadioButton.Group>

            </View>
        )
    }

    handleProductChange(productId) {
        // let PD = this.state.productsData
        // let indx = PD.findIndex(item => item.type == productId)
        // let PN = PD[indx].key
        this.setState({ selectedProductId: productId })
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
        this.setState({ selectedLineIndex: item })

        let _LD = this.state.linesData
        let lineId = _LD[item].id

        // let isChecked_old = item.isChecked

        // let indx = _LD.findIndex(opt => opt.id == item.id)
        // let mod_item = { id: item.id, val: item.val, isChecked: !isChecked_old }

        // _LD[indx] = mod_item

        // this.setState({ linesData: _LD })

        this.setState({ isProductsLoading: true })
        let products = []
        webHandler.getLineProducts(lineId, (respJson) => {
            respJson.data.map((item) => {
                products.push({ id: item.productid, key: item.product_title, type: item.productid })
            })
            this.setState({ productsData: products, isProductsLoading: false })
        }, (error) => {
            this.setState({ isProductsLoading: false })
        })
    }

    handlePlantChange(index) {
        if (index != undefined) {
            let selecetedPlantItem = this.state.plantsWithLines[index]

            var lines = []
            if (!MyUtils.isEmptyArray(selecetedPlantItem)) {
                selecetedPlantItem.lines.map(item => {
                    // lines.push({ id: item.line_id, val: item.line_name, isChecked: false })
                    lines.push({ id: item.line_id, val: item.line_name })
                })
            }

            this.setState({ selectedPlantIndex: index, selectedLineIndex: -1, linesData: lines })
        }
    }

    handleSaveAction() {
        let shiftId = ""
        if (!MyUtils.isEmptyArray(this.state.shiftsData) && this.state.selectedShiftIndex > -1) {
            shiftId = this.state.shiftsData[this.state.selectedShiftIndex].id
        }
        prefManager.setShiftCheckData(
            this.state.isShiftNA,
            this.state.selectedShiftIndex,
            shiftId
        )

        let plantId = ""
        if (!MyUtils.isEmptyArray(this.state.plantsData) && this.state.selectedPlantIndex > -1) {
            plantId = this.state.plantsData[this.state.selectedPlantIndex].id
        }
        prefManager.setPlantCheckData(
            this.state.isPlantNA,
            this.state.selectedPlantIndex,
            plantId
        )

        // prefManager.setLineCheckData(
        //     this.state.isLineNA,
        //     JSON.stringify(this.state.linesData),
        // )

        let lineId = ""
        if (!this.state.isPlantNA && !MyUtils.isEmptyArray(this.state.linesData) && this.state.selectedLineIndex > -1) {
            lineId = this.state.linesData[this.state.selectedLineIndex].id
        }
        prefManager.setLineCheckData(
            this.state.isLineNA,
            this.state.selectedLineIndex,
            lineId
        )

        // let lineStatus = ""
        // if (!MyUtils.isEmptyArray(lineStatusOpts) && this.state.selectedLineStatusIndex > -1) {
        //     lineStatus = lineStatusOpts[this.state.selectedLineStatusIndex]
        // }
        // prefManager.setLineStausData(this.state.isLineStatusNA,
        //     this.state.selectedLineStatusIndex, lineStatus
        // )

        let productId = ""
        if (!this.state.isLineNA && !MyUtils.isEmptyArray(this.state.productsData) && this.state.selectedProductId > -1) {
            prefManager.setDummyLineProductsData(this.state.productsData)
            productId = this.state.selectedProductId
        }
        prefManager.setLineProductData(false, 0, productId)

        if (this.state.isSettingsView != undefined && this.state.isSettingsView &&
            this.state.userRole != prefManager.EDITOR && this.state.userRole != prefManager.ADMIN) {
            prefManager.setReloadReq(true)
        }

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