import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import WebHandler from '../../data/remote/WebHandler'
import MyUtils from '../../utils/MyUtils';
import FormQuestion from './FormQuestion'
import { Button } from 'react-native-elements'
import PrefManager from '../../data/local/PrefManager'
import SelectOptionModal from "../../utils/SelectOptionModal"
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import { appGreyColor } from '../../utils/AppStyles';
import FullImageView from "../../utils/FullImageView"

var count = 0
const photoOptions = [
    { id: 1, key: "Take a photo", icon: "camera", type: "photo" },
    { id: 2, key: "Open Gallery", icon: "image", type: "file" },
    // { id: 3, key: "Record Audio", icon: "mic", type: "audio" },
    { id: 4, key: "Record Video", icon: "video", type: "video" },
]
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
            formQuesAns: [], mediaFiles: [],
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
                        <SelectOptionModal
                            ref="_selectPhotoOptModal"
                            onItemPress={(type) => this.handleMediaFileAction(type)}
                        />
                        <FullImageView
                            ref="_fullImageViewModal"
                        />
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
                        {
                            <View style={[{
                                backgroundColor: '#fff',
                                marginLeft: 10,
                                marginRight: 10,
                                marginBottom: 10,
                                padding: 5,
                                borderRadius: 5
                            }]}>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, flex: 1, fontWeight: "bold", marginBottom: 5 }}>Media Files:</Text>
                                    <TouchableOpacity
                                        onPress={() => { this.refs._selectPhotoOptModal.setModalVisible(photoOptions) }}
                                    >
                                        <Icon name="plus-circle" color={appGreyColor} size={24} />
                                    </TouchableOpacity>
                                </View>
                                {
                                    this.state.mediaFiles.map((item, index) => {
                                        console.log(item)
                                        if (item.type == "image") {
                                            return this.renderImageFileView(item, index)
                                        } else if (item.type == "video") {
                                            return this.renderVideoFileView(item, index)
                                        }
                                    })
                                }
                            </View>
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
        } else if (type == "video") {
            ImagePicker.openCamera({
                mediaType: "video",
                includeExif: true,
            }).then((video) => {
                count++
                this.addNewMediaFile(count, video, "video")
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

    handleVideoPlay(fileData) {
        this.props.navigation.navigate("MyVideoPlayer", {
            _videoUri: fileData.file.path,
            _videoWidth: fileData.file.width,
            _videoHeigth: fileData.file.height
        })
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

    uploadMedia(formId) {
        MyUtils.showSnackbar("Uploading file...", "")
        var uploadPromises = []
        this.state.mediaFiles.map((item, index) => {
            var p = new Promise((resolve, reject) => {
                webHandler.uploadStaticFormMedia(formId, item.file.uri, item.type, (responseJson) => {
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
                this.setState({ isSubmitting: false })
                if (this.props.navigation.state.params.onReload) {
                    this.props.navigation.state.params.onReload()
                }
                this.props.navigation.goBack()
            } else {
                this.setState({ isMediaReUploading: true, submitBtnText: "Re-Upload" })
                alert("Unable to upload media files, try again")
            }
        }).catch(error => {
            this.setState({ isMediaReUploading: true, submitBtnText: "Re-Upload" })
            MyUtils.showSnackbar(JSON.stringify(error), "")
        });
    }

    submitData(respData) {
        this.setState({ isSubmitting: true })
        webHandler.submitFixedFormData(this.state.formId, this.state.assignId, respData, (responseJson) => {
            MyUtils.showSnackbar("form submitted successfully", "")
            if (!MyUtils.isEmptyArray(this.state.mediaFiles)) {
                this.setState({ uploadingIndex: 0 })
                this.uploadMedia(responseJson.id)
            } else {
                if (this.props.navigation.state.params.onReload) {
                    this.props.navigation.state.params.onReload()
                }
                this.props.navigation.goBack()
            }
        }, (error) => {
            MyUtils.showSnackbar(error, "")
            this.setState({ isSubmitting: false })
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
            this.setState({ isSubmitting: false })
        })
    }

}
