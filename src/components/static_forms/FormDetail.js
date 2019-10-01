import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import WebHandler from '../../data/remote/WebHandler'
import MyUtils from '../../utils/MyUtils';
import FormQuestion from './FormQuestion'
import { Button } from 'react-native-elements'

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
            formQuesAns: []
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        this.setState({ isLoading: true })
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
                                    onPress={() => { this.verifyForSubmit() }}
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

    verifyForSubmit() {
        var formQuesAns = [...this.state.formQuesAns]
        var allQues = [...this.state.formData]
        var allQResp = []

        formQuesAns.map((item) => {
            allQResp.push(item.resp)
        })

        if (allQResp.length == 0 || allQues.length != allQResp.length) {
            MyUtils.showSnackbar("Please you need to provide valid answers to all questions.", "")
            return
        }

        var isAllOK = true
        allQResp.map((item, index) => {
            if (!item.isAcceptableAnswer && item.comment == "") {
                MyUtils.showSnackbar("Please you need to provide valid answers to all questions.", "")
                isAllOK = false
                return
            }
        })

        if (isAllOK) {
            console.log(JSON.stringify(allQResp))
            this.submitData(JSON.stringify(allQResp))
        }
    }

    submitData(respData) {
        this.setState({ isSubmitting: true })
        webHandler.submitFixedFormData(this.state.formId, respData, (responseJson) => {
            MyUtils.showSnackbar("form submitted successfully", "")
            this.props.navigation.goBack()
        }, (error) => {
            MyUtils.showSnackbar(error, "")
            this.setState({ isFormSubmitting: false })
        })
    }
}
