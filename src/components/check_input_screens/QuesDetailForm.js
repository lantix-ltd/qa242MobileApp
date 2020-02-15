import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, ToastAndroid, TouchableOpacity, Image, Alert } from "react-native";
import { RadioButton, Chip } from "react-native-paper"
import Icon from 'react-native-vector-icons/Feather'
import MyValuePicker from "../../utils/MyValuePicker"
import { appPinkColor, appYellowColor, appGreyColor } from "../../utils/AppStyles";
import MyUtils from "../../utils/MyUtils";
import SelectMultiOptionModal from "../../utils/SelectMultiOptionModal"
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment'

const shapeOptions = [
    { id: 1, title: "Triangle" },
    { id: 2, title: "Circle" },
    { id: 3, title: "Square" },
    { id: 4, title: "Small Square" },
]

const DATE_TYPE = "Date", TIME_TYPE = "Time", DATETIME_TYPE = "DateTime"
const SINGLE_SELECT = "Choice", MULTI_SELECT = "multi_select"
const DATE_FORMAT = "MM-DD-YYYY", TIME_FORMAT = "00:00:00", DATETIME_FORMAT = "MM-DD-YYYY 00:00:00"

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
            // fixedValInput: props._quesData.answers[0].possible_answer
            fixedValInput: "",
            multiOptions: [],
            timeVal: TIME_FORMAT,
            dateVal: DATE_FORMAT,
            dateTimeVal: DATETIME_FORMAT,
            isDateTimePickerVisible: false,

            isProductionCheckCalculation: props.isProductionCheckCalculation ?
                props.isProductionCheckCalculation : false,
            fillingAutoCalVal: ""
        }
    }

    componentDidMount() {
        let opts = []
        const qDtata = this.state.checkQuesData
        let indx = shapeOptions.findIndex(item => item.title == qDtata.answers[0].possible_answer)
        indx = (indx != undefined && indx > -1) ? indx : 0
        let shapeData = shapeOptions[indx]
        this.setState({ selectedShapeOptId: shapeData.id })
        setTimeout(() => {
            if (qDtata.question_type === "Dropdown") {
                this.updateMyResponse(
                    qDtata.answers[0].answer_id,
                    qDtata.answers[0].possible_answer,
                    this.state.rangeInput,
                    this.state.quesComment,
                    this.state.isAcceptableAnswer
                )
            }
        }, 1000)

        if (qDtata.question_type === MULTI_SELECT) {
            qDtata.answers.map((item, index) => {
                opts.push({
                    id: item.answer_id, key: item.possible_answer,
                    isSelecetd: false, isAcceptable: (item.is_acceptable == "1")
                })
            })
            this.setState({ multiOptions: opts })
        }
    }

    render() {
        let data = this.state.checkQuesData
        return (
            <View style={styles.container}>

                <SelectMultiOptionModal
                    ref="_selectMultiOptionModal"
                    onDonePress={(opts) => this.handleMultiChoiceChange(opts)}
                />

                {data.question_type === "Dropdown" &&
                    <View style={[styles.round_white_bg_container, { flexDirection: "row" }]}>

                        <MyValuePicker ref={"_myValuePicker"}
                            options={shapeOptions}
                            selectedVal={this.state.selectedShapeOptId}
                            onItemPress={(val) => {
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

                    </View>
                }

                {data.question_type === SINGLE_SELECT &&
                    <RadioButton.Group
                        onValueChange={value => this.handleChoiceChange(value)}
                        value={this.state.selectedAnsValue}
                    >
                        {data.answers.map((item, index) => {
                            return (
                                <View key={index}
                                    style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "flex-start" }}>
                                    <RadioButton color={appPinkColor} value={item.answer_id} />
                                    <Text>{item.possible_answer}</Text>
                                </View>
                            )
                        })}
                    </RadioButton.Group>
                }

                {data.question_type == MULTI_SELECT && !MyUtils.isEmptyArray(this.state.multiOptions) &&
                    <View style={[styles.round_white_bg_container, { marginHorizontal: 10 }]}>
                        <TouchableOpacity
                            onPress={() => { this.refs._selectMultiOptionModal.showProgramsTypes(this.state.multiOptions) }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                                <Text style={{ fontSize: 14, flex: 1, fontWeight: "bold", color: appGreyColor }}>Select option</Text>
                                <View style={{ flex: 1 }} />
                                <Icon name="edit" color={appGreyColor} size={24} />
                            </View>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            {
                                this.state.multiOptions.map((item, index) => {
                                    if (item.isSelecetd) {
                                        return (
                                            <Chip key={index} style={{ margin: 5 }}>{item.key}</Chip>
                                        )
                                    }
                                })
                            }
                        </View>
                    </View>
                }

                {(data.question_type == DATE_TYPE || data.question_type == TIME_TYPE || data.question_type == DATETIME_TYPE) &&
                    <View style={[styles.round_white_bg_container, { marginHorizontal: 10 }]}>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            mode={data.question_type.toLowerCase()}
                            date={new Date()}
                            onConfirm={(date) => this.handleDateTimePickerChange(date, data.question_type)}
                            onCancel={() => this.setState({ isDateTimePickerVisible: false })}
                        />
                        <TouchableOpacity
                            onPress={() => { this.setState({ isDateTimePickerVisible: true }) }}
                        >
                            <Text style={{ padding: 5, fontSize: 16, color: "black" }}>
                                {data.question_type == TIME_TYPE && this.state.timeVal}
                                {data.question_type == DATE_TYPE && this.state.dateVal}
                                {data.question_type == DATETIME_TYPE && this.state.dateTimeVal}
                            </Text>
                        </TouchableOpacity>
                    </View>
                }


                {this.state.checkQuesData.question_type === "Fixed" &&
                    <View style={styles.round_white_bg_container}>
                        <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType='default'
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
                            keyboardType='default'
                            returnKeyType="done"
                            value={this.state.rangeInput}
                            numberOfLines={1}
                            multiline={false}
                            placeholder='* Type value here'
                            onChangeText={(text) => this.handleRangeInputChange(text)}
                            placeholderTextColor='#797979' />
                    </View>
                }

                {this.state.isProductionCheckCalculation &&
                    <View>
                        {this.state.checkQuesData.question_type === "Weight" &&
                            <View style={[styles.round_white_bg_container, { flexDirection: "row", justifyContent: "center", alignItems: "center" }]}>
                                <Text style={{ padding: 10, flex: 1, fontSize: 14 }}>{this.state.fillingAutoCalVal}</Text>
                                <TouchableOpacity onPress={() => { this.handleFillingAutoCalculateChange("weight") }}>
                                    <Text>Calculate</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        {this.state.checkQuesData.question_type === "Percentage" &&
                            <View style={[styles.round_white_bg_container, { flexDirection: "row", justifyContent: "center", alignItems: "center" }]}>
                                <Text style={{ padding: 10, flex: 1, fontSize: 14 }}>{this.state.fillingAutoCalVal}</Text>
                                <TouchableOpacity onPress={() => { this.handleFillingAutoCalculateChange("percentage") }}>
                                    <Text>Calculate</Text>
                                </TouchableOpacity>
                            </View>
                        }
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

    updateMyResponse(selecetdAnsId, givenAns, givenRange, comment, isAcceptable) {
        var resp = {
            quesType: this.state.checkQuesData.question_type,
            quesId: this.state.checkQuesData.question_id,
            quesTitle: this.state.checkQuesData.question_title,
            selecetedAnsId: selecetdAnsId,
            givenAns: givenAns,
            givenRange: givenRange,
            comment: isAcceptable ? "" : comment,
            isAcceptableAnswer: isAcceptable
        }
        this.props.onResponse(resp)
    }

    handleChoiceChange(selecetdAnsId) {
        var answers = this.state.checkQuesData.answers
        var indx = answers.findIndex(item => item.answer_id == selecetdAnsId)
        var my_ans = answers[indx]
        var val = my_ans.is_acceptable == "1"
        this.setState({ isAcceptableAnswer: val, fixedValInput: my_ans.possible_answer, selectedAnsValue: selecetdAnsId })
        this.updateMyResponse(selecetdAnsId, my_ans.possible_answer, this.state.rangeInput, this.state.quesComment, val)
    }

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
        var isAcceptable = true
        // if (!MyUtils.isEmptyString(myVal)) {
        //     isAcceptable = (myVal == txt)
        //     ansId = this.state.checkQuesData.answers[0].answer_id
        // }
        this.setState({
            // isAcceptableAnswer: isAcceptable,
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

    handleMultiChoiceChange(opts) {
        let ids = "", ans = "", isAcceptable = false
        opts.map((item) => {
            if (item.isSelecetd) {
                ids = ids + item.id + ","
                ans = ans + item.key + ","
                isAcceptable = true
            }
        })
        this.setState({ multiOptions: opts })
        this.updateMyResponse(ids, ans, "", this.state.quesComment, isAcceptable)
    }

    handleDateTimePickerChange(dateTime, type) {
        var dtOutput = ""
        if (type == DATE_TYPE) {
            dtOutput = moment(dateTime).format("MM-DD-YYYY")
            this.setState({ dateVal: dtOutput })
        } else if (type == TIME_TYPE) {
            dtOutput = moment(dateTime).format("HH:mm:ss")
            this.setState({ timeVal: dtOutput })
        } else if (type == DATETIME_TYPE) {
            dtOutput = moment(dateTime).format("MM-DD-YYYY HH:mm:ss")
            this.setState({ dateTimeVal: dtOutput })
        }
        this.setState({ isDateTimePickerVisible: false })
        this.updateMyResponse("", dtOutput, "", this.state.quesComment, true)
    }

    handleFillingAutoCalculateChange(type) {
        let val = "", isAcceptable = true
        if (type == "weight") {
            val = this.props.getCalculatedFillingWeight()
        } else if (type == "percentage") {
            val = this.props.getCalculatedFillingPercentage()
            let ans = this.state.checkQuesData.answers[0].possible_answer
            isAcceptable = (ans == val)
        }
        console.log("VAL2: " + val)
        this.setState({ fillingAutoCalVal: val, isAcceptableAnswer: isAcceptable })
        this.updateMyResponse("", val, "", this.state.quesComment, isAcceptable)
    }

    updateQuesComment(txt) {
        this.setState({ quesComment: txt })
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