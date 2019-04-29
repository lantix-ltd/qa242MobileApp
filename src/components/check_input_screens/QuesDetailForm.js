import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { RadioButton } from "react-native-paper"
import Icon from 'react-native-vector-icons/Feather'
import MyValuePicker from "../../utils/MyValuePicker"
import { appPinkColor, appYellowColor, appGreyColor } from "../../utils/AppStyles";
import MyUtils from "../../utils/MyUtils";

const shapeOptions = [
    { id: 1, title: "Triangle" },
    { id: 2, title: "Circle" },
    { id: 3, title: "Square" },
    { id: 4, title: "Small Square" },
]

class QuesDetailForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedAnsValue: 0,
            selectedShapeOptId: 0,
            quesComment: "",
            checkQuesData: props._quesData,
            isAcceptableAnswer: true,
            rangeInput: "",
            fixedValInput: props._quesData.answers[0].possible_answer
        }
    }

    componentDidMount() {
        const qDtata = this.state.checkQuesData
        let indx = shapeOptions.findIndex(item => item.title == qDtata.answers[0].possible_answer)
        indx = (indx != undefined && indx > -1) ? indx : 0
        let shapeData = shapeOptions[indx]
        this.setState({ selectedShapeOptId: shapeData.id })
        setTimeout(() => {
            if (qDtata.question_type === "Dropdown" || qDtata.question_type === "Fixed") {
                this.updateMyResponse(
                    qDtata.answers[0].answer_id,
                    qDtata.answers[0].possible_answer,
                    this.state.rangeInput,
                    this.state.quesComment,
                    this.state.isAcceptableAnswer
                )
            }
        }, 1000)
    }

    updateMyResponse(selecetdAnsId, givenAns, givenRange, comment, isAcceptable) {
        var resp = {
            quesType: this.state.checkQuesData.question_type,
            quesId: this.state.checkQuesData.question_id,
            selecetedAnsId: selecetdAnsId,
            givenAns: givenAns,
            givenRange: givenRange,
            comment: comment,
            isAcceptableAnswer: isAcceptable
        }
        this.props.onResponse(resp)
    }

    // handleAnswereChange(selecetdAnsId) {
    //     var answers = this.state.checkQuesData.answers
    //     var indx = answers.findIndex(item => item.answer_id == selecetdAnsId)
    //     var my_ans = answers[indx]
    //     var val = my_ans.is_acceptable == "1"
    //     this.setState({ isAcceptableAnswer: val, selectedAnsValue: selecetdAnsId })
    //     this.updateMyResponse(selecetdAnsId, "", this.state.rangeInput, this.state.quesComment, val)
    // }

    handleDropDownChange(selecetdItem) {
        var answers = this.state.checkQuesData.answers
        var indx = answers.findIndex(item => item.possible_answer == selecetdItem.title)
        var isAcceptable = false
        var selecetdAnsId = ""
        if (indx != undefined && indx > -1) {
            var my_ans = answers[indx]
            var val = my_ans.is_acceptable == "1"
            isAcceptable = val
            selecetdAnsId = my_ans.answer_id
        }
        this.setState({
            isAcceptableAnswer: isAcceptable, selectedAnsValue: selecetdAnsId,
            selectedShapeOptId: selecetdItem.id, fixedValInput: selecetdItem.title
        })
        this.updateMyResponse(selecetdAnsId, selecetdItem.title, this.state.rangeInput, this.state.quesComment, isAcceptable)
    }

    handleFixedInputChange(txt) {
        this.setState({ fixedValInput: txt })
        var myVal = this.state.checkQuesData.answers[0].possible_answer
        var ansId = ""
        var isAcceptable = false
        if (myVal == txt) {
            isAcceptable = true
            ansId = this.state.checkQuesData.answers[0].answer_id
        }
        this.setState({
            isAcceptableAnswer: isAcceptable,
            selectedAnsValue: ansId
        })
        this.updateMyResponse(ansId, txt, this.state.givenRange, this.state.quesComment, isAcceptable)
    }

    handleRangeInputChange(txt) {
        this.setState({ rangeInput: txt })
        var myVal = parseFloat(txt)
        var min = parseFloat(this.state.checkQuesData.answers[0].min)
        var max = parseFloat(this.state.checkQuesData.answers[0].max)
        var val = myVal >= min && myVal <= max
        this.setState({ isAcceptableAnswer: val })
        this.updateMyResponse(this.state.selectedAnsValue, this.state.fixedValInput, txt, this.state.quesComment, val)
    }

    render() {
        return (
            <View style={styles.container}>

                {this.state.checkQuesData.question_type === "Dropdown" &&
                    <View style={[styles.round_white_bg_container, { flexDirection: "row" }]}>

                        <MyValuePicker ref={"_myValuePicker"}
                            options={shapeOptions}
                            selectedVal={this.state.selectedShapeOptId}
                            onItemPress={(val) => {
                                // this.setState({
                                //     selectedAnsValue: val.id,
                                //     selectedAnsTitle: val.title
                                // })
                                this.handleDropDownChange(val)
                            }}
                        />

                        <TouchableOpacity style={{ flex: 1, padding: 5 }}
                            onPress={() => { this.refs._myValuePicker.showMyPicker(this.state.selectedShapeOptId) }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ flex: 1 }}>{this.state.fixedValInput}</Text>
                                <Icon name="chevron-down" color="#ccc" size={20} />
                            </View>
                        </TouchableOpacity>

                        {/* <RadioButton.Group
                            onValueChange={value => this.handleAnswereChange(value)}
                            value={this.state.selectedAnsValue}
                        >
                            {this.state.checkQuesData.answers.map((item, index) => {
                                return (
                                    <View key={index}
                                        style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "flex-start" }}>
                                        <RadioButton color={appPinkColor} value={item.answer_id} />
                                        <Text>{item.possible_answer}</Text>
                                    </View>
                                )
                            })}
                        </RadioButton.Group> */}

                    </View>
                }

                {this.state.checkQuesData.question_type === "Fixed" &&
                    <View style={styles.round_white_bg_container}>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='number-pad'
                            returnKeyType="done"
                            value={this.state.fixedValInput}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type value here'
                            onChangeText={(text) => this.handleFixedInputChange(text)}
                            placeholderTextColor='#797979' />
                    </View>
                }

                {this.state.checkQuesData.question_type === "Range" &&
                    <View style={styles.round_white_bg_container}>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='number-pad'
                            returnKeyType="done"
                            value={this.state.rangeInput}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type value here'
                            onChangeText={(text) => this.handleRangeInputChange(text)}
                            placeholderTextColor='#797979' />
                    </View>
                }

                {!this.state.isAcceptableAnswer &&
                    <View style={styles.round_white_bg_container}>
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                            <Icon name="edit" size={20} color="#CCC" />
                            <TextInput style={{ backgroundColor: "#FFF", flex: 1, textAlignVertical: "center" }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType='default'
                                returnKeyType="done"
                                value={this.state.quesComment}
                                multiline={true}
                                onChangeText={(text) => this.updateQuesComment(text)}
                                placeholder='* What corrective action has been taken?'
                                placeholderTextColor='#797979' />
                        </View>
                    </View>
                }
            </View>
        );
    }

    updateQuesComment(txt) {
        this.setState({ quesComment: txt, isInputDialogVisible: false })
        this.updateMyResponse(
            this.state.selectedAnsValue,
            this.state.fixedValInput,
            this.state.rangeInput,
            txt, this.state.isAcceptableAnswer
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8'
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

export default QuesDetailForm;