import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { RadioButton } from "react-native-paper"
import Icon from 'react-native-vector-icons/Feather'

import { appPinkColor, appYellowColor, appGreyColor } from "../../utils/AppStyles";
import MyUtils from "../../utils/MyUtils";

class QuesDetailForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedAnsValue: '',
            quesComment: "",
            checkQuesData: props._quesData,
            isAcceptableAnswer: true,
            rangeInput: "",
        }
    }

    componentDidMount() {

    }

    updateMyResponse(selecetdAnsId, givenRange, comment, isAcceptable) {
        var resp = {
            quesType: this.state.checkQuesData.question_type,
            quesId: this.state.checkQuesData.question_id,
            selecetedAnsId: selecetdAnsId,
            givenRange: givenRange,
            comment: comment,
            isAcceptableAnswer: isAcceptable
        }
        this.props.onResponse(resp)
    }

    handleAnswereChange(selecetdAnsId) {
        var answers = this.state.checkQuesData.answers
        var indx = answers.findIndex(item => item.answer_id == selecetdAnsId)
        var my_ans = answers[indx]
        var val = my_ans.is_acceptable == "1"
        this.setState({ isAcceptableAnswer: val, selectedAnsValue: selecetdAnsId })
        this.updateMyResponse(selecetdAnsId, this.state.rangeInput, this.state.quesComment, val)
    }

    handleRangeInputChange(txt) {
        this.setState({ rangeInput: txt })
        var myVal = parseFloat(txt)
        var min = parseFloat(this.state.checkQuesData.answers[0].min)
        var max = parseFloat(this.state.checkQuesData.answers[0].max)
        var val = myVal >= min && myVal <= max
        this.setState({ isAcceptableAnswer: val })
        this.updateMyResponse(this.state.selectedAnsValue, txt, this.state.quesComment, val)
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.checkQuesData.question_type === "Choice" &&
                    <View style={[styles.round_white_bg_container, { flexDirection: "row" }]}>
                        <RadioButton.Group
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
                        </RadioButton.Group>
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
        // if (txt != "") {
        // } else {
        //     MyUtils.showSnackbar("Empty text not allowed", "")
        // }
        this.setState({ quesComment: txt, isInputDialogVisible: false })
        this.updateMyResponse(this.state.selectedAnsValue,
            this.state.rangeInput,
            txt, this.state.isAcceptableAnswer)
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
        padding: 10,
        borderRadius: 5
    },
});

export default QuesDetailForm;