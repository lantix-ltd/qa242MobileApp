
import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView } from "react-native";
import { CheckBox, ButtonGroup, Button } from 'react-native-elements'

const yesNo = ["Yes", "No"]
const productTempTypes = ["Nose", "Mid", "Tail"]
const allergenContent = ["W", "E", "D", "TN", "SH", "GF", "None"]
const acceptOrNot = ["Acceptable", "Not Acceptable"]
const acceptHoldReject = ["Accept", "Hold", "Reject"]

class FormNo1 extends Component {

    constructor(props) {
        super(props)
        this.state = {
            monitorName: "",
            time: "",
            InvoiceNo: "",
            itemName: "",
            supplierName: "",
            SPApprovedIndex: 0,
            carrierName: "",
            truckLPlate: "",
            trailerLPlate: "",
            driverLInfo: "",
            trailerSealedIndx: 0,
            trailerLockedIndx: 0,
            materialsFreeIndex: 0,
            truckInsideIndx: 0,
            productCondtionIndx: 0,
            productTempIndx: 0,
            vvOfProductIndx: 0,
            allergenContentIndx: 0,
            allergentaqggedIndx: 0,
            markedWithExpDateIndx: 0,
            inspectionSummaryIndx: 0,
            followUpAction: "",
            correctiveActionDetail: ""
        }
    }


    render() {
        return (
            <ScrollView style={styles.container}>

                <View style={[styles.round_white_bg_container, { marginTop: 10 }]}>
                    <Text>Monitor (Receiver) Name/ Initials: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.monitorName}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ monitorName: text })}
                        placeholderTextColor='#797979' />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Time: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.time}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ time: text })}
                        placeholderTextColor='#797979' />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>P.O./Invoice No.: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.InvoiceNo}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ InvoiceNo: text })}
                        placeholderTextColor='#797979' />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Item Name: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.itemName}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ itemName: text })}
                        placeholderTextColor='#797979' />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Suppler Name: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.supplierName}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ supplierName: text })}
                        placeholderTextColor='#797979' />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Is Supplier and Product On the Approved List? </Text>
                    <ButtonGroup
                        selectedIndex={this.state.SPApprovedIndex}
                        onPress={(index) => this.setState({ SPApprovedIndex: index })}
                        buttons={yesNo}
                        containerStyle={{ height: 50 }}
                    />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Carrier Name: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.carrierName}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ carrierName: text })}
                        placeholderTextColor='#797979' />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Truck License Plate: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.truckLPlate}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ truckLPlate: text })}
                        placeholderTextColor='#797979' />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Trailer License Plate: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.trailerLPlate}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ trailerLPlate: text })}
                        placeholderTextColor='#797979' />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Driver License Info (Name, State): </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.driverLInfo}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ driverLInfo: text })}
                        placeholderTextColor='#797979' />
                </View>

                <View style={[styles.round_white_bg_container, { flexDirection: "row" }]}>
                    <View style={{ flex: 1 }}>
                        <Text>Is Trailer Sealed?</Text>
                        <ButtonGroup
                            selectedIndex={this.state.trailerSealedIndx}
                            onPress={(index) => this.setState({ trailerSealedIndx: index })}
                            buttons={yesNo}
                            containerStyle={{ height: 50 }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>Is Trailer Locked?</Text>
                        <ButtonGroup
                            selectedIndex={this.state.trailerLockedIndx}
                            onPress={(index) => this.setState({ trailerLockedIndx: index })}
                            buttons={yesNo}
                            containerStyle={{ height: 50 }}
                        />
                    </View>
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Are the trailer and materials free of signs of tampering? </Text>
                    <ButtonGroup
                        selectedIndex={this.state.materialsFreeIndex}
                        onPress={(index) => this.setState({ materialsFreeIndex: index })}
                        buttons={yesNo}
                        containerStyle={{ height: 50 }}
                    />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Is Truck inside condition acceptable? (Visual Inspection free of contamination (pest, spill, off odors, etc.) </Text>
                    <ButtonGroup
                        selectedIndex={this.state.truckInsideIndx}
                        onPress={(index) => this.setState({ truckInsideIndx: index })}
                        buttons={yesNo}
                        containerStyle={{ height: 50 }}
                    />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Are Product Condition (# damaged)/Pallet Condition (not broken, smelly, contaminated) Acceptable? </Text>
                    <ButtonGroup
                        selectedIndex={this.state.productCondtionIndx}
                        onPress={(index) => this.setState({ productCondtionIndx: index })}
                        buttons={yesNo}
                        containerStyle={{ height: 50 }}
                    />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>{"Product Temperature (Check one random case per pallet at nose, mid and tail of load) Record all 3 temps. (FROZEN <10° F, REF. 32-40 deg°F); Cheese 45°F Max. Record 'Ambient' if Shelf Stable Materials. "}</Text>
                    <ButtonGroup
                        selectedIndex={this.state.productTempIndx}
                        onPress={(index) => this.setState({ productTempIndx: index })}
                        buttons={productTempTypes}
                        containerStyle={{ height: 50 }}
                    />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Visual Verification of Product - Do Quantity/Lot Codes Received Match BOL/P.O./Invoice? </Text>
                    <ButtonGroup
                        selectedIndex={this.state.vvOfProductIndx}
                        onPress={(index) => this.setState({ vvOfProductIndx: index })}
                        buttons={yesNo}
                        containerStyle={{ height: 50 }}
                    />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>{"Allergen Verification: Note Allergen Content of items Received.  (Circle Appropriate and note specific allergen type when Tree Nuts (TN) and/or Shellfish (SH) is received) Note: Gluten Free is treated as an allergen:"} </Text>
                    <ButtonGroup
                        selectedIndex={this.state.allergenContentIndx}
                        onPress={(index) => this.setState({ selectedShiftIndex: index })}
                        buttons={allergenContent}
                        containerStyle={{ height: 50 }}
                    />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>If Product Contains Allergens, Was it Allergen Tagged During Receiving?  </Text>
                    <ButtonGroup
                        selectedIndex={this.state.allergentaqggedIndx}
                        onPress={(index) => this.setState({ allergentaqggedIndx: index })}
                        buttons={yesNo}
                        containerStyle={{ height: 50 }}
                    />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>{"Was the Product Marked with Expiration Date, Where Appropriate (e.g. dairy)? Are days remaining before expiry adequate?"} </Text>
                    <ButtonGroup
                        selectedIndex={this.state.markedWithExpDateIndx}
                        onPress={(index) => this.setState({ markedWithExpDateIndx: index })}
                        buttons={acceptOrNot}
                        containerStyle={{ height: 50 }}
                    />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Inspection Summary (Check Appropriate) </Text>
                    <ButtonGroup
                        selectedIndex={this.state.inspectionSummaryIndx}
                        onPress={(index) => this.setState({ inspectionSummaryIndx: index })}
                        buttons={acceptHoldReject}
                        containerStyle={{ height: 50 }}
                    />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Follow-up action if Hold or Reject: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.followUpAction}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ followUpAction: text })}
                        placeholderTextColor='#797979' />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>{"Corrective Action Detail: (For all non-conformances above (No or unacceptable responses, record what the corrective action was, who performed it (name), and date performed)"} </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.correctiveActionDetail}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ correctiveActionDetail: text })}
                        placeholderTextColor='#797979' />
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
                        onPress={() => { this.handleInspectionForm() }}
                        containerStyle={{ margin: 5, flex: 1 }}
                        buttonStyle={{ backgroundColor: "red", marginEnd: 5 }}
                    />
                </View>

            </ScrollView>
        );
    }

    submitForm() {

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

export default FormNo1;