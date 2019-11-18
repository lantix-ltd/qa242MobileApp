import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import WebHandler from '../../data/remote/WebHandler'
import MyUtils from '../../utils/MyUtils';
import FormQuestion from './FormQuestion'
import { Button } from 'react-native-elements'
import PrefManager from '../../data/local/PrefManager'

const prefManager = new PrefManager()
const DRAFT_TYPE = "DRAFT", SUBMIT_TYPE = "SUBMIT"
const webHandler = new WebHandler()

export default class FormDetail extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('_formName'),
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isSubmitting: false,
            formData: [],
            formId: props.navigation.getParam('_formId'),
            assignId: props.navigation.getParam('_assignId'),
            isDraft: props.navigation.getParam('_isDraft', false),
            formQuesAns: []
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        this.setState({ isLoading: true })
        if (this.state.isDraft) {
            webHandler.getFixedFormDraftDetail(this.state.formId, this.state.assignId, (responseJson) => {
                this.setState({
                    formData: responseJson.final_array,
                    isLoading: false
                })
            }, (error) => {
                this.setState({ isLoading: false })
                MyUtils.showSnackbar(error, "")
            })
        } else {
            webHandler.getFixedCheckData(this.state.formId, (responseJson) => {
                this.setState({
                    formData: responseJson.final_array,
                    isLoading: false
                })
            }, (error) => {
                this.setState({ isLoading: false })
                MyUtils.showSnackbar(error, "")
            })
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.isLoading && MyUtils.renderLoadingView()}
                {!this.state.isLoading && MyUtils.isEmptyArray(this.state.formData) &&
                    MyUtils.renderErrorView("Unable to load form data",
                        () => { this.loadData() }
                    )
                }
                {!this.state.isLoading && !MyUtils.isEmptyArray(this.state.formData) &&
                    <ScrollView style={{ flex: 1 }}>
                        {
                            this.state.formData.map((item, index) => {
                                return (
                                    <FormQuestion
                                        key={index}
                                        quesNo={(index + 1)}
                                        quesData={item}
                                        givenAnswer={item.given_answer}
                                        onResponse={(resp) => { this.updateCheckResp(item.question_id, resp) }}
                                    />
                                )
                            })
                        }
                        {!this.state.isSubmitting &&
                            <View style={{ flexDirection: "row", padding: 10 }}>
                                <Button
                                    title={"Submit"}
                                    containerStyle={{ flex: 1 }}
                                    buttonStyle={{ backgroundColor: "green", marginEnd: 5 }}
                                    onPress={() => { this.verifyForSubmit(SUBMIT_TYPE) }}
                                />
                                <Button
                                    title={"Save as draft"}
                                    containerStyle={{ flex: 1 }}
                                    buttonStyle={{ backgroundColor: "orange", marginEnd: 5 }}
                                    onPress={() => { this.verifyForSubmit(DRAFT_TYPE) }}
                                />
                                <Button
                                    title="CANCEL"
                                    containerStyle={{ flex: 1 }}
                                    buttonStyle={{ backgroundColor: "red", marginStart: 5 }}
                                    onPress={() => { this.props.navigation.goBack() }}
                                />
                            </View>
                        }
                        {this.state.isSubmitting && MyUtils.renderLoadingView()}
                    </ScrollView>
                }
            </View>
        )
    }

    updateCheckResp(quesId, resp) {
        var _prevResp = [...this.state.formQuesAns]
        if (!MyUtils.isEmptyArray(_prevResp)) {
            var index = _prevResp.findIndex(item =>
                (item.resp.quesId == resp.quesId))
            if (index > -1) {
                _prevResp[index] = { quesId, resp }
            } else {
                _prevResp.push({ quesId, resp })
            }
        } else {
            _prevResp.push({ quesId, resp })
        }
        this.setState({ formQuesAns: _prevResp })
    }

    verifyForSubmit(type) {
        var formQuesAns = [...this.state.formQuesAns]
        var allQues = [...this.state.formData]
        var allQResp = []

        formQuesAns.map((item) => {
            allQResp.push(item.resp)
        })

        var isAllOK = true
        if (type == SUBMIT_TYPE && (allQResp.length == 0 || allQues.length != allQResp.length)) {
            MyUtils.showSnackbar("Please you need to provide valid answers to all questions.", "")
            isAllOK = false
        } else if (type == SUBMIT_TYPE) {
            allQResp.map((item, index) => {
                if (!item.isAcceptableAnswer && item.comment == "") {
                    MyUtils.showSnackbar("Please you need to provide a corrective action.", "")
                    isAllOK = false
                    return
                }
            })
        }

        if (type == DRAFT_TYPE && allQResp.length == 0) {
            MyUtils.showSnackbar("Please you need to provide valid answers to all questions.", "")
            isAllOK = false
        }

        // allQResp.map((item, index) => {
        //     if (!item.isAcceptableAnswer && item.comment == "") {
        //         MyUtils.showSnackbar("Please you need to provide a corrective action.", "")
        //         isAllOK = false
        //         return
        //     }
        // })

        console.log(JSON.stringify(allQResp))
        if (isAllOK && type == SUBMIT_TYPE) {
            this.submitData(JSON.stringify(allQResp))
        } else if (isAllOK && type == DRAFT_TYPE) {
            this.saveAsDraft(JSON.stringify(allQResp))
        }
    }

    submitData(respData) {
        this.setState({ isSubmitting: true })
        webHandler.submitFixedFormData(this.state.formId, this.state.assignId, respData, (responseJson) => {
            MyUtils.showSnackbar("form submitted successfully", "")
            if (this.props.navigation.state.params.onReload) {
                this.props.navigation.state.params.onReload()
            }
            this.props.navigation.goBack()
        }, (error) => {
            MyUtils.showSnackbar(error, "")
            this.setState({ isFormSubmitting: false })
        })
    }

    saveAsDraft(respData) {
        this.setState({ isSubmitting: true })
        webHandler.submitFixedFormAsDraftData(this.state.formId, this.state.assignId, respData, (responseJson) => {
            MyUtils.showSnackbar("form saved as draft", "")
            if (this.props.navigation.state.params.onReload) {
                this.props.navigation.state.params.onReload()
            }
            prefManager.setReloadReq(true)
            this.props.navigation.goBack()
        }, (error) => {
            MyUtils.showSnackbar(error, "")
            this.setState({ isFormSubmitting: false })
        })
    }

}
