import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { RadioButton, Chip } from "react-native-paper"
import { appPinkColor, appGreyColor } from '../../utils/AppStyles'
import MyUtils from '../../utils/MyUtils'
import Icon from 'react-native-vector-icons/Feather'
import SelectMultiOptionModal from "../../utils/SelectMultiOptionModal"
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment'

const CHOICE_TYPE = "choice", RANGE_TYPE = "range", TEXT_TYPE = "text"
const DATE_TYPE = "date", TIME_TYPE = "time", DATETIME_TYPE = "datetime"
const SINGLE_SELECT = "single_select", MULTI_SELECT = "multi_select"
const DATE_FORMAT = "MM-DD-YYYY", TIME_FORMAT = "00:00:00", DATETIME_FORMAT = "MM-DD-YYYY 00:00:00"

export default class FormQuestion extends Component {

    constructor(props) {
        super(props)
        this.state = {
            quesNo: props.quesNo,
            quesData: props.quesData,
            selectedAnsId: 0,
            selectedAnsVal: "",
            isAcceptableAnswer: true,
            quesComment: "",
            multiOptions: [],
            textTypeAns: "",
            selectedRangeTypeIndex: 0,
            timeVal: TIME_FORMAT,
            dateVal: DATE_FORMAT,
            dateTimeVal: DATETIME_FORMAT,
            isDateTimePickerVisible: false,
            givenAnswer: props.givenAnswer,
        }
    }

    componentDidMount() {
        let opts = []
        if (this.state.givenAnswer && this.state.givenAnswer != null) {
            let ga = this.state.givenAnswer
            this.setState({ quesComment: ga.comment })
            setTimeout(() => {
                if (ga.da_answer_type == CHOICE_TYPE && this.state.quesData.selection == SINGLE_SELECT) {
                    this.handleSingleChoiceChange(ga.answer_id)
                } else if (ga.da_answer_type == CHOICE_TYPE && this.state.quesData.selection == MULTI_SELECT) {
                    this.state.quesData.possible_answer.map((item, index) => {
                        opts.push({
                            id: item.answer_id, key: item.answer,
                            isSelecetd: this.isOptSelected(ga.answer, item.answer), isAcceptable: (item.acceptance == "acceptable")
                        })
                    })
                    this.setState({ multiOptions: opts })
                    this.handleMultiChoiceChange(opts)
                } else if (ga.da_answer_type == RANGE_TYPE) {
                    this.handleRangeInputChange(ga.answer)
                } else if (ga.da_answer_type == TEXT_TYPE) {
                    this.handleTextAnsChange(ga.answer)
                } else if (ga.da_answer_type == DATE_TYPE || ga.da_answer_type == TIME_TYPE || ga.da_answer_type == DATETIME_TYPE) {
                    this.handleDateTimePickerChange(ga.answer, this.state.quesData.question_type)
                }
            }, 500)
        } else if (this.state.quesData.selection == MULTI_SELECT) {
            this.state.quesData.possible_answer.map((item, index) => {
                opts.push({
                    id: item.answer_id, key: item.answer,
                    isSelecetd: false, isAcceptable: (item.acceptance == "acceptable")
                })
            })
            this.setState({ multiOptions: opts })
        }
    }

    isOptSelected(selectedOpts, opt) {
        let val = false
        if (!MyUtils.isEmptyString(selectedOpts) && !MyUtils.isEmptyString(opt)) {
            let sOpts = []
            sOpts = selectedOpts.split(",")
            if (!MyUtils.isEmptyArray(sOpts)) {
                let indx = sOpts.findIndex(item => item == opt)
                val = (indx != undefined && indx > -1)
            }
        }
        return val
    }

    render() {
        const data = this.state.quesData
        if (data == undefined && data == null) {
            return (MyUtils.renderErrorView("Unable to load form data", () => { }))
        } else {
            return (
                <View style={styles.container}>

                    <SelectMultiOptionModal
                        ref="_selectMultiOptionModal"
                        onDonePress={(opts) => this.handleMultiChoiceChange(opts)}
                    />

                    <View style={styles.round_white_bg_container}>
                        {this.renderQuestionHeading(data.question)}
                        {data.question_type == CHOICE_TYPE &&
                            <View>
                                {(data.selection == SINGLE_SELECT) &&
                                    <RadioButton.Group
                                        onValueChange={value => this.handleSingleChoiceChange(value)}
                                        value={this.state.selectedAnsId}
                                    >
                                        {data.possible_answer.map((item, index) => {
                                            return (
                                                <View key={index}
                                                    style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "flex-start" }}>
                                                    <RadioButton color={appPinkColor} value={item.answer_id} />
                                                    <Text>{item.answer}</Text>
                                                </View>
                                            )
                                        })}
                                    </RadioButton.Group>
                                }
                                {data.selection == MULTI_SELECT && !MyUtils.isEmptyArray(this.state.multiOptions) &&
                                    <View style={{ marginHorizontal: 10 }}>
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
                            </View>
                        }

                        {data.question_type == RANGE_TYPE &&
                            <View>
                                <Text style={{ fontSize: 14, marginHorizontal: 10 }}>
                                    {!MyUtils.isEmptyArray(data.possible_answer[this.state.selectedRangeTypeIndex].data) &&
                                        "(Acceptable range: "
                                        + data.possible_answer[this.state.selectedRangeTypeIndex].data[0].min + " - "
                                        + data.possible_answer[this.state.selectedRangeTypeIndex].data[0].max + ")"
                                    }
                                </Text>
                                <RadioButton.Group
                                    onValueChange={value => this.setState({
                                        selectedRangeTypeIndex: value,
                                        selectedAnsVal: "",
                                        isAcceptableAnswer: true
                                    })}
                                    value={this.state.selectedRangeTypeIndex}
                                >
                                    {data.possible_answer.map((item, index) => {
                                        return (
                                            <View key={index}
                                                style={{ flexDirection: "row", flex: 1, alignItems: "center", justifyContent: "flex-start" }}>
                                                <RadioButton color={appPinkColor} value={index} />
                                                <Text>{item.name}</Text>
                                            </View>
                                        )
                                    })}
                                </RadioButton.Group>
                                <View style={{ marginHorizontal: 10 }}>
                                    <TextInput style={{ backgroundColor: "#FFF", flex: 1, textAlignVertical: "center" }}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType='number-pad'
                                        returnKeyType="done"
                                        value={this.state.selectedAnsVal}
                                        multiline={true}
                                        onChangeText={(text) => this.handleRangeInputChange(text)}
                                        placeholder='* Type here'
                                        placeholderTextColor='#797979' />
                                </View>
                            </View>
                        }

                        {data.question_type == TEXT_TYPE &&
                            <View style={{ marginHorizontal: 10 }}>
                                <TextInput style={{ backgroundColor: "#FFF", flex: 1, textAlignVertical: "center" }}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="done"
                                    value={this.state.textTypeAns}
                                    multiline={true}
                                    onChangeText={(text) => this.handleTextAnsChange(text)}
                                    placeholder='* Type here'
                                    placeholderTextColor='#797979' />
                            </View>
                        }

                        {(data.question_type == DATE_TYPE || data.question_type == TIME_TYPE || data.question_type == DATETIME_TYPE) &&
                            <View style={{ marginHorizontal: 10 }}>
                                <DateTimePicker
                                    isVisible={this.state.isDateTimePickerVisible}
                                    mode={data.question_type}
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

                        {!this.state.isAcceptableAnswer && this.renderCorrectiveAnsField()}
                    </View>

                </View >
            )
        }
    }

    handleSingleChoiceChange(selectedAnsId) {
        var answers = this.state.quesData.possible_answer
        var indx = answers.findIndex(item => item.answer_id == selectedAnsId)
        var my_ans = answers[indx]
        var val = my_ans.acceptance == "acceptable"
        this.setState({ isAcceptableAnswer: val, selectedAnsId: selectedAnsId })
        this.updateMyResponse(selectedAnsId, my_ans.answer, this.state.quesComment, val)
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
        this.updateMyResponse(ids, ans, this.state.quesComment, isAcceptable)
    }

    handleTextAnsChange(txt) {
        this.setState({ textTypeAns: txt })
        this.updateMyResponse("", txt, this.state.quesComment, !MyUtils.isEmptyString(txt))
    }

    handleRangeInputChange(val) {
        var is_in_range = true
        var answers = this.state.quesData.possible_answer
        var my_ans = answers[this.state.selectedRangeTypeIndex]
        if (!MyUtils.isEmptyArray(my_ans)) {
            var data = my_ans.data[0]
            if (!MyUtils.isEmptyArray(data)) {
                let givenVal = parseFloat(val)
                let min = parseFloat(data.min)
                let max = parseFloat(data.max)
                is_in_range = (givenVal >= min && givenVal <= max)
            }
        }
        this.setState({ selectedAnsVal: val, isAcceptableAnswer: is_in_range })
        this.updateMyResponse("", val, this.state.quesComment, is_in_range)
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
        this.updateMyResponse("", dtOutput, this.state.quesComment, true)
    }

    renderQuestionHeading(heading) {
        return (
            <View style={{ flex: 1, flexDirection: "row", padding: 10, justifyContent: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: "700", }}>
                    {(this.state.quesNo) + ". "}
                </Text>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text style={{ fontSize: 16 }}>
                        {heading}
                    </Text>
                </View>
            </View>
        )
    }

    renderCorrectiveAnsField() {
        return (
            <View style={styles.corrective_field_bg}>
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
        )
    }

    updateQuesComment(txt) {
        this.setState({ quesComment: txt })
        this.updateMyResponse(
            this.state.selectedAnsId,
            this.state.selectedAnsVal,
            txt,
            this.state.isAcceptableAnswer
        )
    }

    updateMyResponse(selectedAnsId, givenAns, comment, isAcceptable) {
        var resp = {
            quesType: this.state.quesData.question_type,
            quesId: this.state.quesData.question_id,
            selection: this.state.quesData.selection,
            selecetedAnsId: selectedAnsId,
            givenAns: givenAns,
            comment: isAcceptable ? "" : comment,
            isAcceptableAnswer: isAcceptable
        }
        this.props.onResponse(resp)
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
    corrective_field_bg: {
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 5
    }
});

