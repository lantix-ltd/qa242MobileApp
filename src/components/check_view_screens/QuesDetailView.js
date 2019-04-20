import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { RadioButton } from "react-native-paper"
import Icon from 'react-native-vector-icons/Feather'

import { appPinkColor, appYellowColor, appGreyColor } from "../../utils/AppStyles";

class QuesDetailView extends Component {

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
        const qData = this.state.checkQuesData
        if (qData != undefined && qData != null) {
            if (qData.question_type === "Choice") {
                this.setState({
                    selectedAnsValue: qData.givenanswers[0].answer_id,
                    quesComment: qData.givenanswers[0].comments,
                })
                this.handleAnswereChange(qData.givenanswers[0].answer_id)
            } else if (qData.question_type === "Range") {
                this.setState({
                    rangeInput: qData.givenanswers[0].range,
                    quesComment: qData.givenanswers[0].comments,
                })
                this.handleRangeInputChange(qData.givenanswers[0].range)
            }
        }
    }

    handleAnswereChange(selecetdAnsId) {
        var answers = this.state.checkQuesData.answers
        var indx = answers.findIndex(item => item.answer_id == selecetdAnsId)
        var my_ans = answers[indx]
        var val = my_ans.is_acceptable == "1"
        this.setState({ isAcceptableAnswer: val, selectedAnsValue: my_ans.possible_answer })
    }

    handleRangeInputChange(txt) {
        this.setState({ rangeInput: txt })
        var myVal = parseFloat(txt)
        var min = parseFloat(this.state.checkQuesData.answers[0].min)
        var max = parseFloat(this.state.checkQuesData.answers[0].max)
        var val = myVal >= min && myVal <= max
        this.setState({ isAcceptableAnswer: val })
    }

    render() {
        return (
            <View style={styles.container}>
                {(this.state.checkQuesData.question_type === "Choice" &&
                    this.state.isAcceptableAnswer) &&
                    <View style={styles.round_white_bg_container}>
                        <Text style={{ paddingHorizontal: 10, fontSize: 15 }}>
                            {this.state.selectedAnsValue}
                        </Text>
                    </View>
                }

                {this.state.checkQuesData.question_type === "Range" &&
                    <View style={styles.round_white_bg_container}>
                        <Text style={{ paddingHorizontal: 10, fontSize: 15 }}>
                            {this.state.rangeInput}
                        </Text>
                    </View>
                }

                {!this.state.isAcceptableAnswer &&
                    <View style={styles.round_white_bg_container}>
                        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                            <Text style={{ flex: 1, paddingHorizontal: 10, }}>
                                {this.state.quesComment}
                            </Text>
                        </View>
                    </View>
                }
            </View>
        );
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

export default QuesDetailView;