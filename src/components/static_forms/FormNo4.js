import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { CheckBox, ButtonGroup, Button } from 'react-native-elements'
import Modal from "react-native-modal";
import { appPinkColor } from "../../utils/AppStyles";
import WebHandler from "../../data/remote/WebHandler"
import FormNo4QView from "./FormNo4QView"
import MyUtils from "../../utils/MyUtils";
import DateTimePicker from "react-native-modal-datetime-picker";

const acceptUnaccept = ["Acceptable", "Unacceptable"]
const circleOptions = ["Pre-Op Inspection", "Changeover"]

const webHandler = new WebHandler()
class FormNo4 extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: "PPC-2 Cleaning Inspection",
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            circleSelectedVal: 0,
            plProduced: "",
            allergenProfile1: "",
            ptbStarted: "",
            allergenProfile2: "",

            q1SelectedVal: 0,
            q1CorrectiveAction: "",
            q2SelectedVal: 0,
            q2CorrectiveAction: "",
            q3SelectedVal: 0,
            q3CorrectiveAction: "",
            q4SelectedVal: 0,
            q4CorrectiveAction: "",
            q5SelectedVal: 0,
            q5CorrectiveAction: "",

            q6SelectedVal: 0,
            q6CorrectiveAction: "",
            q7SelectedVal: 0,
            q7CorrectiveAction: "",
            q8SelectedVal: 0,
            q8CorrectiveAction: "",
            q9SelectedVal: 0,
            q9CorrectiveAction: "",
            q10SelectedVal: 0,
            q10CorrectiveAction: "",

            q11SelectedVal: 0,
            q11CorrectiveAction: "",
            q12SelectedVal: 0,
            q12CorrectiveAction: "",
            q13SelectedVal: 0,
            q13CorrectiveAction: "",
            q14SelectedVal: 0,
            q14CorrectiveAction: "",
            q15SelectedVal: 0,
            q15CorrectiveAction: "",

            q16SelectedVal: 0,
            q16CorrectiveAction: "",
            q17SelectedVal: 0,
            q17CorrectiveAction: "",
            q18SelectedVal: 0,
            q18CorrectiveAction: "",
            q19SelectedVal: 0,
            q19CorrectiveAction: "",
            q20SelectedVal: 0,
            q20CorrectiveAction: "",
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

    render() {
        const hintColor = "#ccc"
        return (
            <ScrollView style={styles.container}>
                {this.renderLoadingDialog()}

                <View style={[styles.round_white_bg_container]}>
                    <Text>Circle: </Text>
                    <ButtonGroup
                        selectedIndex={this.state.circleSelectedVal}
                        onPress={(index) => this.setState({ circleSelectedVal: index })}
                        buttons={circleOptions}
                        containerStyle={{ height: 45 }}
                    />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Product Last Produced: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.plProduced}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ plProduced: text })}
                        placeholderTextColor={hintColor} />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Allergn Profile: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.allergenProfile1}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ allergenProfile1: text })}
                        placeholderTextColor={hintColor} />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Product to be Started: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.ptbStarted}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ ptbStarted: text })}
                        placeholderTextColor={hintColor} />
                </View>

                <View style={[styles.round_white_bg_container]}>
                    <Text>Allergn Profile: </Text>
                    <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType='default'
                        returnKeyType="done"
                        value={this.state.allergenProfile2}
                        numberOfLines={1}
                        multiline={false}
                        placeholder='* Type here'
                        onChangeText={(text) => this.setState({ allergenProfile2: text })}
                        placeholderTextColor={hintColor} />
                </View>

                <FormNo4QView
                    title={"No visible food debris or contaminants on exposed food contact surfaces after allergen cleaning. (Pre-Op check list conforming)"}
                    onButtonChange={(index) => this.setState({ q1SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q1CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Verify product formulation and ingredients"}
                    onButtonChange={(index) => this.setState({ q2SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q2CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"All food contact surfaces conform to the Parameters/ Limits (Negative - protein indicator swabbing example seafood, gluten, etc.)"}
                    onButtonChange={(index) => this.setState({ q3SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q3CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Filling mixer/ Dough mixer"}
                    onButtonChange={(index) => this.setState({ q4SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q4CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"770's / Agnelli machine parts, clean and knobs intact"}
                    onButtonChange={(index) => this.setState({ q5SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q5CorrectiveAction: txt })}
                />

                <FormNo4QView
                    title={"Beginning of pasteurizer - shaker/spreader"}
                    onButtonChange={(index) => this.setState({ q6SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q6CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"End of pasteurizer - vibrator"}
                    onButtonChange={(index) => this.setState({ q7SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q7CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Conveyors - pasteurizer & cooling conveyors"}
                    onButtonChange={(index) => this.setState({ q8SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q8CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Product entry to spiral freezer - Guides, Edges"}
                    onButtonChange={(index) => this.setState({ q9SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q9CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Spiral freezer, clean and light covers intact"}
                    onButtonChange={(index) => this.setState({ q10SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q10CorrectiveAction: txt })}
                />

                <FormNo4QView
                    title={"Spiral discharge area"}
                    onButtonChange={(index) => this.setState({ q11SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q11CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Incline conveyor's"}
                    onButtonChange={(index) => this.setState({ q12SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q12CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Pasta weighing machine-Ishida scale"}
                    onButtonChange={(index) => this.setState({ q13SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q13CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Discharge shoot to packaging"}
                    onButtonChange={(index) => this.setState({ q14SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q14CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Verify the bulk product by checking the filling"}
                    onButtonChange={(index) => this.setState({ q15SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q15CorrectiveAction: txt })}
                />

                <FormNo4QView
                    title={"No product or residue from previews run (packaging)"}
                    onButtonChange={(index) => this.setState({ q16SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q16CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Employee glove & sleeve changes performed as necessary."}
                    onButtonChange={(index) => this.setState({ q17SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q17CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Coats/smocks and aprons changed"}
                    onButtonChange={(index) => this.setState({ q18SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q18CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Labeling is correct (All other labels removed from line)"}
                    onButtonChange={(index) => this.setState({ q19SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q19CorrectiveAction: txt })}
                />
                <FormNo4QView
                    title={"Metal detector rejects removed (Reject units documented on PPC-5)"}
                    onButtonChange={(index) => this.setState({ q20SelectedVal: index })}
                    onTextChange={(txt) => this.setState({ q20CorrectiveAction: txt })}
                />

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
        let v1 = acceptUnaccept[this.state.q1SelectedVal]
        let v2 = this.state.q1CorrectiveAction
        let v3 = acceptUnaccept[this.state.q2SelectedVal]
        let v4 = this.state.q2CorrectiveAction
        let v5 = acceptUnaccept[this.state.q3SelectedVal]
        let v6 = this.state.q3CorrectiveAction
        let v7 = acceptUnaccept[this.state.q4SelectedVal]
        let v8 = this.state.q4CorrectiveAction
        let v9 = acceptUnaccept[this.state.q5SelectedVal]
        let v10 = this.state.q5CorrectiveAction
        let v11 = acceptUnaccept[this.state.q6SelectedVal]
        let v12 = this.state.q6CorrectiveAction
        let v13 = acceptUnaccept[this.state.q7SelectedVal]
        let v14 = this.state.q7CorrectiveAction
        let v15 = acceptUnaccept[this.state.q8SelectedVal]
        let v16 = this.state.q8CorrectiveAction
        let v17 = acceptUnaccept[this.state.q9SelectedVal]
        let v18 = this.state.q9CorrectiveAction
        let v19 = acceptUnaccept[this.state.q10SelectedVal]
        let v20 = this.state.q10CorrectiveAction
        let v21 = acceptUnaccept[this.state.q11SelectedVal]
        let v22 = this.state.q11CorrectiveAction
        let v23 = acceptUnaccept[this.state.q12SelectedVal]
        let v24 = this.state.q12CorrectiveAction
        let v25 = acceptUnaccept[this.state.q13SelectedVal]
        let v26 = this.state.q13CorrectiveAction
        let v27 = acceptUnaccept[this.state.q14SelectedVal]
        let v28 = this.state.q14CorrectiveAction
        let v29 = acceptUnaccept[this.state.q15SelectedVal]
        let v30 = this.state.q15CorrectiveAction
        let v31 = acceptUnaccept[this.state.q16SelectedVal]
        let v32 = this.state.q16CorrectiveAction
        let v33 = acceptUnaccept[this.state.q17SelectedVal]
        let v34 = this.state.q17CorrectiveAction
        let v35 = acceptUnaccept[this.state.q18SelectedVal]
        let v36 = this.state.q18CorrectiveAction
        let v37 = acceptUnaccept[this.state.q19SelectedVal]
        let v38 = this.state.q19CorrectiveAction
        let v39 = acceptUnaccept[this.state.q20SelectedVal]
        let v40 = this.state.q20CorrectiveAction

        let v41 = circleOptions[this.state.circleSelectedVal]
        let v42 = this.state.plProduced
        let v43 = this.state.allergenProfile1
        let v44 = this.state.ptbStarted
        let v45 = this.state.allergenProfile2

        if (MyUtils.isEmptyString(v42) || MyUtils.isEmptyString(v43) || MyUtils.isEmptyString(v44) || MyUtils.isEmptyString(v45)) {
            MyUtils.showSnackbar("Please fill all required (*) fields", "")
            return;
        }

        let formData = {
            q1SelectedVal: v1,
            q1CorrectiveAction: v2,
            q2SelectedVal: v3,
            q2CorrectiveAction: v4,
            q3SelectedVal: v5,
            q3CorrectiveAction: v6,
            q4SelectedVal: v7,
            q4CorrectiveAction: v8,
            q5SelectedVal: v9,
            q5CorrectiveAction: v10,
            q6SelectedVal: v11,
            q6CorrectiveAction: v12,
            q7SelectedVal: v13,
            q7CorrectiveAction: v14,
            q8SelectedVal: v15,
            q8CorrectiveAction: v16,
            q9SelectedVal: v17,
            q9CorrectiveAction: v18,
            q10SelectedVal: v19,
            q10CorrectiveAction: v20,
            q11SelectedVal: v21,
            q11CorrectiveAction: v22,
            q12SelectedVal: v23,
            q12CorrectiveAction: v24,
            q13SelectedVal: v25,
            q13CorrectiveAction: v26,
            q14SelectedVal: v27,
            q14CorrectiveAction: v28,
            q15SelectedVal: v29,
            q15CorrectiveAction: v30,
            q16SelectedVal: v31,
            q16CorrectiveAction: v32,
            q17SelectedVal: v33,
            q17CorrectiveAction: v34,
            q18SelectedVal: v35,
            q18CorrectiveAction: v36,
            q19SelectedVal: v37,
            q19CorrectiveAction: v38,
            q20SelectedVal: v39,
            q20CorrectiveAction: v40,
            circleSelectedVal: v41,
            plProduced: v42,
            allergenProfile1: v43,
            ptbStarted: v44,
            allergenProfile2: v45
        }

        this.setState({ isFormSubmitting: true })
        webHandler.submitCleaningInspectionForm(formData, (responseJson) => {
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

export default FormNo4