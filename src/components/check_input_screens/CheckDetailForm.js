import React, { Component } from "react";
import {
    View, Text, Image, StyleSheet, SafeAreaView, ScrollView,
    TouchableOpacity, ActivityIndicator
} from "react-native";
import { Chip } from "react-native-paper"
import { Button } from 'react-native-elements'
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Feather';
import { appPinkColor, appYellowColor, appGreyColor, primaryColor } from "../../utils/AppStyles";
import MyUtils from "../../utils/MyUtils";
import WebHandler from "../../data/remote/WebHandler"
import QuesDetailForm from "./QuesDetailForm"
import SelectOptionModal from "../../utils/SelectOptionModal"
import SelectMultiOptionModal from "../../utils/SelectMultiOptionModal"
import MyAudioRecorder from "../../utils/MyAudioRecorder"
import FullImageView from "../../utils/FullImageView"
import { ButtonGroup, CheckBox } from 'react-native-elements'
import NetInfo from '@react-native-community/netinfo'
import LocalDBManager from "../../data/local/LocalDBManager";

const localDB = new LocalDBManager()
const LINE_DOWN_DEF_VAL = "LINE DOWN"
const PTYPE_NA_VAL = "1"
const GEN_QA_CHECK = "general qa check"
const webHandler = new WebHandler()
var count = 0

const photoOptions = [
    { id: 1, key: "Take a photo", icon: "camera", type: "photo" },
    { id: 2, key: "Open Gallery", icon: "image", type: "file" },
    // { id: 3, key: "Record Audio", icon: "mic", type: "audio" },
    { id: 4, key: "Record Video", icon: "video", type: "video" },
]
const lineStatusOpts = ['Active', 'Down']

class CheckDetailForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            refreshing: false,
            mediaFiles: [],
            isSoundPlaying: false,
            submitBtnText: "Submit",

            checkId: props.navigation.getParam("_id", ""),
            checkTitle: props.navigation.getParam("_title", ""),
            checkType: props.navigation.getParam("_check_type", ""),
            checkDetail: props.navigation.getParam("_check_detail", []),
            isError: false, errorMsg: "",
            checkQuesRefs: [],
            isFormSubmitting: false,
            selectedProgramtypes: [],
            isMediaReUploading: false,

            lineStatusIndex: 0,
            isNetworkAvailable: true
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('_title'),
        }
    };

    componentDidMount() {
        this.setState({ isLoading: true })
        this.setUpForInternetConnectivity()
        this.loadProgramTypes()
        this.loadData()
        // console.log(this.state.checkDetail)
    }


    componentWillUnmount() {
        if (this.internetListener) {
            this.internetListener()
        }
    }

    setUpForInternetConnectivity() {
        this.internetListener = NetInfo.addEventListener(info => {
            this.setState({ isNetworkAvailable: info.isConnected })
        })
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

    loadData() {
        localDB.getCheckDetail(this.state.checkId, (detail) => {
            if (detail) {
                this.setState({ checkDetail: detail, isLoading: false })
            } else {
                webHandler.getCheckListDetail(this.state.checkId,
                    (responseJson) => {
                        this.setState({
                            checkDetail: responseJson.data[0],
                            isLoading: false, refreshing: false
                        })
                        localDB.updateCheckDetail(this.state.checkId, responseJson.data[0])
                    },
                    (error) => {
                        MyUtils.showSnackbar(error, "")
                        this.setState({ isLoading: false, refreshing: false, isError: true, errorMsg: error })
                    }
                )
            }
        })
        // if (!this.state.checkDetail || this.state.checkDetail == []) {
        //     webHandler.getCheckListDetail(this.state.checkId,
        //         (responseJson) => {
        //             this.setState({
        //                 checkDetail: responseJson.data[0],
        //                 isLoading: false, refreshing: false
        //             })
        //         },
        //         (error) => {
        //             MyUtils.showSnackbar(error, "")
        //             this.setState({ isLoading: false, refreshing: false, isError: true, errorMsg: error })
        //         }
        //     )
        // } else {
        //     this.setState({ isLoading: false })
        // }
    }

    loadProgramTypes() {
        var programType = [
            { id: 1, key: "N/A", isSelecetd: false, isAcceptable: false },
            { id: 2, key: "Seafood", isSelecetd: false, isAcceptable: true },
            { id: 3, key: "USDA", isSelecetd: false, isAcceptable: true },
            { id: 4, key: "FDA", isSelecetd: false, isAcceptable: true },
            { id: 5, key: "Gluten free", isSelecetd: false, isAcceptable: true },
            { id: 6, key: "Organic", isSelecetd: false, isAcceptable: true },
            { id: 7, key: "TKosher", isSelecetd: false, isAcceptable: true },
            { id: 8, key: "Halal", isSelecetd: false, isAcceptable: true },
            { id: 9, key: "Non- GMO", isSelecetd: false, isAcceptable: true },
            { id: 10, key: "5S Program", isSelecetd: false, isAcceptable: true },
        ]
        this.setState({ selectedProgramtypes: programType })
    }

    renderItem(item, index) {
        return (
            <View style={{ flex: 1 }}>

                <View style={{ marginHorizontal: 10 }} pointerEvents={this.state.lineStatusIndex == 1 ? 'none' : 'auto'}>
                    <Text style={{
                        fontSize: 16, textAlign: "center",
                        fontWeight: "bold", marginVertical: 10
                    }}>{item.productname}</Text>

                    <Text style={{
                        fontSize: 15, color: appPinkColor, marginVertical: 5
                    }}>{"* Please provide the following input:"}
                    </Text>

                    {item.questions.map((quest, q_index) => {
                        return (
                            <View key={q_index}>
                                {(quest.question_type === "Dropdown" || quest.question_type === "Fixed" ||
                                    quest.question_type === "Choice" || quest.question_type === "multi_select" ||
                                    quest.question_type === "Date" || quest.question_type === "Time" ||
                                    quest.question_type === "DateTime"
                                ) &&
                                    <View style={{ flex: 1, flexDirection: "row", padding: 10, justifyContent: "center" }}>
                                        <Text style={{ fontSize: 16, fontWeight: "700", color: appPinkColor }}>
                                            {(q_index + 1) + ". "}
                                        </Text>
                                        <View style={{ flex: 1, flexDirection: "row" }}>
                                            <Text style={{ fontSize: 16, color: appPinkColor }}>
                                                {quest.question_title}
                                            </Text>
                                        </View>
                                    </View>
                                }

                                {quest.question_type === "Range" &&
                                    <View style={{ flex: 1, flexDirection: "row", padding: 10, justifyContent: "center" }}>
                                        <Text style={{ fontSize: 16, fontWeight: "700", color: appPinkColor }}>
                                            {(q_index + 1) + ". "}
                                        </Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 16, color: appPinkColor }}>
                                                {quest.question_title}
                                            </Text>
                                            <Text style={{ fontSize: 14 }}>
                                                {"(Acceptable range: "
                                                    + quest.answers[0].min + " - "
                                                    + quest.answers[0].max + ")"
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                }

                                {item.is_calculation == "1" && (quest.question_type === "Weight" || quest.question_type === "Percentage") &&
                                    <View style={{ flex: 1, flexDirection: "row", padding: 10, justifyContent: "center" }}>
                                        <Text style={{ fontSize: 16, fontWeight: "700", color: appPinkColor }}>
                                            {(q_index + 1) + ". "}
                                        </Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 16, color: appPinkColor }}>
                                                {quest.question_title}
                                            </Text>
                                            {quest.question_type === "Percentage" &&
                                                <Text style={{ fontSize: 14 }}>
                                                    {"(Acceptable answer: " + quest.answers[0].possible_answer + ")"}
                                                </Text>
                                            }
                                        </View>
                                    </View>
                                }

                                <View style={{ width: "100%" }}>
                                    <QuesDetailForm _quesData={quest}
                                        isProductionCheckCalculation={item.is_calculation == "1"}
                                        onResponse={(resp) => {
                                            this.updateCheckResp(item.productid, resp)
                                        }}
                                        getCalculatedFillingWeight={() => { return this.getFillingValue(item.productid, quest, "weight") }}
                                        getCalculatedFillingPercentage={() => { return this.getFillingValue(item.productid, quest, "percentage") }}
                                        onDisableChildQues={(parentId) => { console.log("ParentID", parentId) }}
                                        onUpdateChildQues={(parentId, isAcceptable) => { this.onUpdateChildQues(parentId, isAcceptable) }}
                                    />
                                </View>
                                <View style={{ height: 1, backgroundColor: "#ccc", marginHorizontal: 5 }} />
                                {quest.isDisabled && <View style={[styles.overlay, { height: '100%' }]} />}
                            </View>
                        )
                    })}

                    <View style={[styles.round_white_bg_container, { marginTop: 10 }]}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 14, flex: 1, fontWeight: "bold", color: appPinkColor, marginBottom: 5 }}>Media Files:</Text>
                            <TouchableOpacity
                                onPress={() => { this.refs._selectPhotoOptModal.setModalVisible(photoOptions) }}
                            >
                                <Icon name="plus-circle" color={appGreyColor} size={24} />
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.mediaFiles.map((item, index) => {
                                if (item.type == "image") {
                                    return this.renderImageFileView(item, index)
                                } else if (item.type == "audio") {
                                    return this.renderAudioFileView(item, index)
                                } else if (item.type == "video") {
                                    return this.renderVideoFileView(item, index)
                                }
                            })
                        }
                    </View>

                    {/* {this.state.checkType == GEN_QA_CHECK &&
                        <View style={[styles.round_white_bg_container, { marginTop: 10 }]}>
                            <TouchableOpacity
                                onPress={() => { this.refs._selectMultiOptionModal.showProgramsTypes(this.state.selectedProgramtypes) }}
                            >
                                <View
                                    style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 5 }}>
                                    <Text style={{ fontSize: 14, flex: 1, fontWeight: "bold", color: appPinkColor }}>Program Types:</Text>
                                    <Icon name="edit" color={appGreyColor} size={24} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                {
                                    this.state.selectedProgramtypes.map((item, index) => {
                                        if (item.isSelecetd) {
                                            return (
                                                <Chip key={index} style={{ margin: 5 }}>{item.key}</Chip>
                                            )
                                        }
                                    })
                                }
                            </View>
                        </View>
                    } */}

                </View>
                {this.state.lineStatusIndex == 1 && <View style={[styles.overlay, { height: '100%' }]} />}

            </View>
        )
    }

    getFillingValue(topicId, ques, type) {
        let val = 0
        let { checkQuesRefs } = this.state
        console.log(JSON.stringify(ques))
        console.log(JSON.stringify(checkQuesRefs))

        let wwIndx = checkQuesRefs.findIndex(item => (item.topicId == topicId && item.resp.quesTitle == "Whole Weight"))
        let dwIndx = checkQuesRefs.findIndex(item => (item.topicId == topicId && item.resp.quesTitle == "Dough Weight"))

        if (wwIndx > -1 && dwIndx > -1) {
            let ww = checkQuesRefs[wwIndx].resp.givenAns
            let dw = checkQuesRefs[dwIndx].resp.givenAns
            if ((ww && ww != "" && !isNaN(ww)) && (dw && dw != "" && !isNaN(dw))) {
                if (type == "weight") {
                    val = parseFloat(ww) - parseFloat(dw)
                } else if (type == "percentage") {
                    let fw = parseFloat(ww) - parseFloat(dw)
                    val = fw / parseFloat(ww) * 100
                }
            }
        }

        console.log("VAL: " + val)
        if (val > 0) {
            val = val.toFixed(2)
        }

        return val
    }

    onUpdateChildQues(quesId, isAcceptable) {
        let { checkDetail } = this.state
        // console.log(JSON.stringify(checkDetail))
        checkDetail.questions.map((q, qi) => {
            if (q.parent_id == quesId) {
                q.isDisabled = !isAcceptable
            }
        })
        this.setState({ checkDetail })
    }

    renderLineStatusView() {
        return (
            <View style={styles.round_white_bg_container}>
                <Text style={{ fontSize: 16, padding: 5, fontWeight: "bold", color: "#000" }}> * What is the line status? </Text>
                <ButtonGroup
                    onPress={(index) => this.setState({ lineStatusIndex: index })}
                    selectedIndex={this.state.lineStatusIndex}
                    buttons={lineStatusOpts}
                    selectedButtonStyle={{ backgroundColor: primaryColor }}
                    containerStyle={{ height: 40 }}
                />
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {this.renderLoadingDialog()}
                    {!this.state.isNetworkAvailable &&
                        <View style={{ backgroundColor: "red", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ padding: 5, color: "#fff", fontSize: 12, fontWeight: "bold" }}>
                                No Internet Connection: Offline Mode
                            </Text>
                        </View>
                    }
                    {this.state.isLoading && MyUtils.renderLoadingView()}
                    {(!this.state.isLoading && !this.state.isError && !MyUtils.isEmptyArray(this.state.checkDetail)) &&

                        <View style={{ flex: 1 }}>
                            {MyUtils.isEmptyArray(this.state.checkDetail.questions) &&
                                MyUtils.renderErrorView("Check detail is not available", () => {
                                    this.setState({ isLoading: true, isError: false })
                                    this.loadData()
                                })
                            }
                            {!MyUtils.isEmptyArray(this.state.checkDetail.questions) &&
                                <View style={{ flex: 1 }}>

                                    <ScrollView style={{ flex: 1 }}>
                                        {!MyUtils.isEmptyString(this.state.checkDetail.productid) &&
                                            this.state.checkDetail.productid != "0" && this.renderLineStatusView()}
                                        {this.renderItem(this.state.checkDetail, 0)}
                                    </ScrollView>

                                    <View style={{ flexDirection: "row", padding: 10 }}>
                                        <Button
                                            title={this.state.submitBtnText.toUpperCase()}
                                            containerStyle={{ flex: 1 }}
                                            buttonStyle={{ backgroundColor: "green", marginEnd: 5 }}
                                            onPress={() => {
                                                this.verifyForSubmit(
                                                    this.state.checkDetail.productid,
                                                    this.state.checkDetail.questions)
                                            }}
                                        />
                                        <Button
                                            title="CANCEL"
                                            containerStyle={{ flex: 1 }}
                                            buttonStyle={{ backgroundColor: "red", marginStart: 5 }}
                                            onPress={() => { this.props.navigation.goBack() }}
                                        />
                                    </View>

                                    <SelectOptionModal
                                        ref="_selectPhotoOptModal"
                                        onItemPress={(type) => this.handleMediaFileAction(type)}
                                    />
                                    <SelectMultiOptionModal
                                        ref="_selectMultiOptionModal"
                                        onDonePress={(types) => this.setState({ selectedProgramtypes: types })}
                                    />
                                    <MyAudioRecorder
                                        ref="_myAudioRecorder"
                                        onDone={(filePath) => {
                                            count++
                                            this.addNewMediaFile(count, filePath, "audio")
                                        }}
                                    />
                                    <FullImageView
                                        ref="_fullImageViewModal"
                                    />
                                </View>
                            }
                        </View>
                    }
                    {this.state.isError && MyUtils.renderErrorView(this.state.errorMsg, () => {
                        this.setState({ isLoading: true, isError: false })
                        this.loadData()
                    })}
                </View>
            </SafeAreaView>
        );
    }

    updateCheckResp(topicId, resp) {
        var _prevResp = [...this.state.checkQuesRefs]
        if (_prevResp != undefined && _prevResp.length > 0) {
            var index = _prevResp.findIndex(item =>
                (item.resp.quesId == resp.quesId && item.topicId == topicId))
            if (index > -1) {
                _prevResp[index] = { topicId, resp }
            } else {
                _prevResp.push({ topicId, resp })
            }
        } else {
            _prevResp.push({ topicId, resp })
        }
        this.setState({ checkQuesRefs: _prevResp })
    }

    verifyForSubmit(topicId, quesData) {
        var allResp = [...this.state.checkQuesRefs]
        var topicResp = []
        var pTypes = PTYPE_NA_VAL

        if (this.state.lineStatusIndex == 1) {
            this.handleForLineDown()
            return
        }

        let { checkDetail } = this.state
        // console.log("QUESTIONS", JSON.stringify(checkDetail.questions))
        // console.log("RESPONSE", JSON.stringify(allResp))

        checkDetail.questions.map((cq, cqi) => {
            if (cq.isDisabled) {
                let resIndx = allResp.findIndex(i => i.resp.quesId == cq.question_id)
                let resp = {
                    quesType: cq.question_type,
                    quesId: cq.question_id,
                    selecetedAnsId: "",
                    givenAns: "",
                    givenRange: "",
                    comment: "N/A",
                    isAcceptableAnswer: false
                }
                if (resIndx > -1) {
                    allResp[resIndx].resp = resp
                } else {
                    allResp.push({ topicId, resp })
                }
            }
        })

        allResp.map((item, index) => {
            if (item.topicId == topicId) {
                topicResp.push(item)
            }
        })

        // console.log("FINAL RESPONSE", JSON.stringify(allResp))

        if (topicResp.length == 0 || topicResp.length != quesData.length) {
            MyUtils.showSnackbar("Please you need to provide valid answers to all questions.", "")
            return
        }

        var isAllOK = true
        topicResp.map((item, index) => {
            if (!item.resp.isAcceptableAnswer && item.resp.comment == "") {
                MyUtils.showSnackbar("Please you need to provide valid answers to all questions.", "")
                isAllOK = false
                return
            }
        })

        // if (this.state.checkType == GEN_QA_CHECK) {
        //     pTypes = ""
        //     pTypes = this.getSelectedProgramTypes()
        //     if (pTypes == "") {
        //         MyUtils.showSnackbar("Please select a program type.", "")
        //         isAllOK = false
        //         return
        //     }
        // }

        if (isAllOK) {
            this.submitData(JSON.stringify(topicResp), pTypes)
        }
    }

    handleForLineDown() {
        let checkQues = this.state.checkDetail.questions
        if (!MyUtils.isEmptyArray(checkQues)) {
            let ans = []
            checkQues.map((item) => {
                let resp = {
                    quesType: item.question_type,
                    quesId: item.question_id,
                    selecetedAnsId: "",
                    givenAns: "",
                    givenRange: "",
                    comment: LINE_DOWN_DEF_VAL,
                    isAcceptableAnswer: false
                }
                ans.push({ resp: resp })
            })
            this.submitData(JSON.stringify(ans), PTYPE_NA_VAL)
        }
    }

    submitData(quesResp, PTypes) {
        let { isNetworkAvailable, isMediaReUploading,
            checkId, checkTitle, mediaFiles } = this.state

        if (isNetworkAvailable) {
            this.setState({ isFormSubmitting: true })
            if (isMediaReUploading) {
                webHandler.deleteCheckMedia(checkId, (responseJson) => {
                    this.uploadMedia()
                }, error => {
                    alert("Unable to upload media files, try again")
                })
                return;
            }

            webHandler.submitCheck(checkId, checkTitle, quesResp, PTypes,
                (responseJson) => {
                    MyUtils.showSnackbar("Form submitted successfully!", "")
                    if (!MyUtils.isEmptyArray(mediaFiles)) {
                        this.setState({ uploadingIndex: 0 })
                        this.uploadMedia()
                    } else {
                        this.setState({ isFormSubmitting: false })
                        this.props.navigation.state.params.onReload()
                        this.props.navigation.goBack();
                    }
                }, error => {
                    MyUtils.showCustomAlert("Check Submit Failed", error)
                    this.setState({ isFormSubmitting: false, submitBtnText: "Re-Submit" })
                })
        } else {
            this.setState({ isFormSubmitting: true })
            let formData = { checkId, checkTitle, quesResp, PTypes, mediaFiles }
            localDB.updatePendingFormsData(formData, () => {
                this.setState({ isFormSubmitting: false })
                this.props.navigation.state.params.onReload()
                this.props.navigation.goBack();
            }, (msg) => {
                this.setState({ isFormSubmitting: false })
                MyUtils.showSnackbar(msg, "red")
            })
        }
    }

    uploadMedia() {
        MyUtils.showSnackbar("Uploading file...", "")
        var uploadPromises = []
        this.state.mediaFiles.map((item, index) => {
            var p = new Promise((resolve, reject) => {
                webHandler.uploadCheckMedia(this.state.checkId, item.file.uri, item.type, (responseJson) => {
                    resolve("File " + (index + 1) + " uploaded")
                }, (error) => {
                    reject(new Error(error))
                })
            })
            uploadPromises.push(p)
        });
        Promise.all(uploadPromises).then(result => {
            if (this.state.mediaFiles.length == result.length) {
                MyUtils.showSnackbar("All media files uploaded successfully", "")
                this.setState({ isFormSubmitting: false })
                this.props.navigation.state.params.onReload()
                this.props.navigation.goBack();
            } else {
                this.setState({ isMediaReUploading: true, submitBtnText: "Re-Upload" })
                alert("Unable to upload media files, try again")
            }
        }).catch(error => {
            this.setState({ isMediaReUploading: true, submitBtnText: "Re-Upload" })
            MyUtils.showSnackbar(JSON.stringify(error), "")
        });
    }

    getSelectedProgramTypes() {
        var values = ""
        this.state.selectedProgramtypes.map(item => {
            if (item.isSelecetd) {
                values = values + item.id + ","
            }
        })
        return values;
    }

    renderImageFileView(item, index) {
        return (
            <View key={index} style={{ marginTop: 5, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.refs._fullImageViewModal.loadImage(item.file.uri) }}>
                    <Image key={index}
                        style={{
                            height: 200,
                            width: "80%",
                            padding: 5,
                        }}
                        source={{ uri: item.file.uri }} />
                </TouchableOpacity>

                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { this.removeMediaFile(item) }}>
                    <Icon name="x-circle" size={24} color="red" />
                </TouchableOpacity>
            </View>
        )
    }

    renderAudioFileView(item, index) {
        return (
            <View key={index} style={{ marginTop: 5, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handlePlayStop(item) }}>
                    <Image
                        style={{
                            height: 120,
                            width: 120,
                            padding: 5,
                        }}
                        resizeMode="contain"
                        source={require("../../assets/images/audio_file_cover.jpg")} />
                </TouchableOpacity>

                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { this.removeMediaFile(item) }}>
                    <Icon name="x-circle" size={24} color="red" />
                </TouchableOpacity>

            </View>
        )
    }

    renderVideoFileView(item, index) {
        return (
            <View key={index} style={{ marginTop: 5, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handleVideoPlay(item) }}>
                    <Image
                        style={{
                            height: 120,
                            width: 120,
                            padding: 5,
                        }}
                        resizeMode="contain"
                        source={require("../../assets/images/video_file_icon.png")} />
                </TouchableOpacity>

                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { this.removeMediaFile(item) }}>
                    <Icon name="x-circle" size={24} color="red" />
                </TouchableOpacity>

            </View>
        )
    }

    handleMediaFileAction(type) {
        if (type == "photo") {
            ImagePicker.openCamera({
                cropping: true,
                width: 300,
                height: 400,
                includeExif: true,
            }).then(image => {
                console.log('received image', image);
                let img = { uri: image.path, width: image.width, height: image.height }
                count++
                this.addNewMediaFile(count, img, "image")
            }).catch(e => console.log(e));
        } else if (type == "video") {
            ImagePicker.openCamera({
                mediaType: "video",
                includeExif: true,
            }).then((video) => {
                count++
                this.addNewMediaFile(count, video, "video")
            }).catch(reason => { console.log(reason) });
        } else if (type == "audio") {
            this.refs._myAudioRecorder.setModalVisible(true)
        } else if (type == "file") {
            ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true
            }).then(image => {
                console.log(image);
                let img = { uri: image.path, width: image.width, height: image.height, mime: image.mime }
                count++
                this.addNewMediaFile(count, img, "image")
            }).catch(reason => { console.log(reason) });
        }
    }

    addNewMediaFile(id, file, type) {
        var mediaFile = { id, file, type }
        var mediaFiles = [...this.state.mediaFiles, mediaFile]
        this.setState({ mediaFiles })
    }

    removeMediaFile(file) {
        var mediaFiles = [...this.state.mediaFiles]
        var index = mediaFiles.findIndex(item => item.id == file.id)
        if (index != undefined && index != -1) {
            mediaFiles.splice(index, 1)
        }
        this.setState({ mediaFiles })
    }

    async handlePlayStop(fileData) {
        var sound
        if (this.state.isSoundPlaying && sound != undefined) {
            sound.stop()
        } else {
            setTimeout(() => {
                sound = new Sound(fileData.file, '', (error) => {
                    if (error) {
                        console.log('failed to load the sound', error);
                    }
                });

                setTimeout(() => {
                    sound.play((success) => {
                        if (success) {
                            console.log('successfully finished playing');
                        } else {
                            console.log('playback failed due to audio decoding errors');
                        }
                    });
                }, 100);
            }, 100);
        }
    }

    handleVideoPlay(fileData) {
        this.props.navigation.navigate("MyVideoPlayer", {
            _videoUri: fileData.file.path,
            _videoWidth: fileData.file.width,
            _videoHeigth: fileData.file.height
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    round_white_bg_container: {
        backgroundColor: '#fff',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        padding: 10,
        overflow: 'hidden',
        borderRadius: 5
    },
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.5,
        backgroundColor: '#fff',
        width: '100%'
    }
});

export default CheckDetailForm;