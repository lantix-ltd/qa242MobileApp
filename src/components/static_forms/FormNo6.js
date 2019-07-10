import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { CheckBox, ButtonGroup, Button } from 'react-native-elements'
import Modal from "react-native-modal";
import { appPinkColor } from "../../utils/AppStyles";
import WebHandler from "../../data/remote/WebHandler"
import FormNo4QView from "./FormNo4QView"
import MyUtils from "../../utils/MyUtils";
import DateTimePicker from "react-native-modal-datetime-picker";

const webHandler = new WebHandler()
class FormNo6 extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Repack/ Recode Form",
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            isFormSubmitting: false,

            source_item_no: "",
            source_product_temp: "",
            source_brand_name: "",
            source_product_name: "",
            source_allergens: "",
            source_case_used: "",
            source_production_date: "MM-DD-YYYY",
            isSourceProductionDateVis: false,
            source_nav_lot_code: "",

            pack_to_item_no: "",
            pack_to_brand_name: "",
            pack_to_product_name: "",
            pack_to_allergens: "",
            pack_to_cases_made: "",
            pack_to_exp_date: "MM-DD-YYYY",
            isPackToExpDateVis: false,

            comments: "",
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

    handleSourceProductionDatePicker(date) {
        this.setState({ isSourceProductionDateVis: false })
        var d = new Date(date)

        let dt = MyUtils.getWith0Digit((d.getMonth() + 1)) + "-" + MyUtils.getWith0Digit(d.getDate()) + "-" + d.getFullYear()
        this.setState({ source_production_date: dt })
    }

    handlePackToExpDatePicker(date) {
        this.setState({ isPackToExpDateVis: false })
        var d = new Date(date)
        let dt = MyUtils.getWith0Digit((d.getMonth() + 1)) + "-" + MyUtils.getWith0Digit(d.getDate()) + "-" + d.getFullYear()
        this.setState({ pack_to_exp_date: dt })
    }

    render() {
        const hintColor = "#ccc"
        return (
            <ScrollView style={styles.container}>
                {this.renderLoadingDialog()}

                <DateTimePicker
                    isVisible={this.state.isSourceProductionDateVis}
                    mode={"date"}
                    date={new Date()}
                    onConfirm={(date) => this.handleSourceProductionDatePicker(date)}
                    onCancel={() => this.setState({ isSourceProductionDateVis: false })}
                />

                <DateTimePicker
                    isVisible={this.state.isPackToExpDateVis}
                    mode={"date"}
                    date={new Date()}
                    onConfirm={(date) => this.handlePackToExpDatePicker(date)}
                    onCancel={() => this.setState({ isPackToExpDateVis: false })}
                />

                <View style={[styles.round_white_bg_container]}>

                    <Text style={{ color: "#000", fontSize: 20, marginBottom: 10 }}>Source:</Text>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Item Number: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.source_item_no}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ source_item_no: text })}
                            placeholderTextColor={hintColor} />
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Product Temperature: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.source_product_temp}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ source_product_temp: text })}
                            placeholderTextColor={hintColor} />
                    </View>


                    <View style={[styles.round_white_bg_container]}>
                        <Text>Brand Name: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.source_brand_name}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ source_brand_name: text })}
                            placeholderTextColor={hintColor} />
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Product Name: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.source_product_name}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ source_product_name: text })}
                            placeholderTextColor={hintColor} />
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Allergen(s) Content (list all allergens): </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.source_allergens}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ source_allergens: text })}
                            placeholderTextColor={hintColor} />
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Cases Used: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.source_case_used}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ source_case_used: text })}
                            placeholderTextColor={hintColor} />
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Original Production Date/ Bulk ID Tag Date:</Text>
                        <TouchableOpacity
                            onPress={() => { this.setState({ isSourceProductionDateVis: true }) }}
                        >
                            <Text style={{ padding: 5, fontSize: 16, color: "black" }}>{this.state.source_production_date} </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Nav Lot Code: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.source_nav_lot_code}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ source_nav_lot_code: text })}
                            placeholderTextColor={hintColor} />
                    </View>

                </View>

                <View style={[styles.round_white_bg_container]}>

                    <Text style={{ color: "#000", fontSize: 20, marginBottom: 10 }}>Pack To:</Text>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Item Number: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.pack_to_item_no}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ pack_to_item_no: text })}
                            placeholderTextColor={hintColor} />
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Brand Name: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.pack_to_brand_name}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ pack_to_brand_name: text })}
                            placeholderTextColor={hintColor} />
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Product Name: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.pack_to_product_name}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ pack_to_product_name: text })}
                            placeholderTextColor={hintColor} />
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Allergen(s) Content (list all allergens): </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.pack_to_allergens}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ pack_to_allergens: text })}
                            placeholderTextColor={hintColor} />
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Cases Made: </Text>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.pack_to_cases_made}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type here'
                            onChangeText={(text) => this.setState({ pack_to_cases_made: text })}
                            placeholderTextColor={hintColor} />
                    </View>

                    <View style={[styles.round_white_bg_container]}>
                        <Text>Expiration Date:</Text>
                        <TouchableOpacity
                            onPress={() => { this.setState({ isPackToExpDateVis: true }) }}
                        >
                            <Text style={{ padding: 5, fontSize: 16, color: "black" }}>{this.state.pack_to_exp_date} </Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Comments: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.comments}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='Type here'
                        onChangeText={(text) => this.setState({ comments: text })}
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
        let v1 = this.state.source_item_no
        let v2 = this.state.source_product_temp
        let v3 = this.state.source_brand_name
        let v4 = this.state.source_product_name
        let v5 = this.state.source_allergens
        let v6 = this.state.source_case_used
        let v7 = this.state.source_production_date
        let v8 = this.state.source_nav_lot_code

        let v9 = this.state.pack_to_item_no
        let v10 = this.state.pack_to_brand_name
        let v11 = this.state.pack_to_product_name
        let v12 = this.state.pack_to_allergens
        let v13 = this.state.pack_to_cases_made
        let v14 = this.state.pack_to_exp_date
        let v15 = this.state.comments

        if (MyUtils.isEmptyString(v1) || MyUtils.isEmptyString(v2) || MyUtils.isEmptyString(v3) || MyUtils.isEmptyString(v4) ||
            MyUtils.isEmptyString(v5) || MyUtils.isEmptyString(v6) || MyUtils.isEmptyString(v8) || MyUtils.isEmptyString(v9) ||
            MyUtils.isEmptyString(v10) || MyUtils.isEmptyString(v11) || MyUtils.isEmptyString(v12) || MyUtils.isEmptyString(v13)) {
            MyUtils.showSnackbar("Please fill all required (*) fields", "")
            return;
        }

        let formData = {
            source_item_no: v1,
            source_product_temp: v2,
            source_brand_name: v3,
            source_product_name: v4,
            source_allergens: v5,
            source_case_used: v6,
            source_production_date: v7,
            source_nav_lot_code: v8,
            pack_to_item_no: v9,
            pack_to_brand_name: v10,
            pack_to_product_name: v11,
            pack_to_allergens: v12,
            pack_to_cases_made: v13,
            pack_to_exp_date: v14,
            comments: v15
        }

        this.setState({ isFormSubmitting: true })
        webHandler.submitRepackInspectionForm(formData, (responseJson) => {
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

export default FormNo6