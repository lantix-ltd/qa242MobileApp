import React, { Component } from "react";
import {
    View, Text, Image, StyleSheet, FlatList, ScrollView,
    TouchableHighlight, TouchableOpacity, ActivityIndicator
} from "react-native";
import { RadioButton } from "react-native-paper"
import { Button } from 'react-native-elements'
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Feather';

import { appPinkColor, appYellowColor, appGreyColor } from "../../utils/AppStyles";
import Panel from "../../utils/Panel"
import MyUtils from "../../utils/MyUtils";
import WebHandler from "../../data/remote/WebHandler"
import QuesDetailForm from "./QuesDetailForm"
import SelectOptionModal from "../../utils/SelectOptionModal"
import MyAudioRecorder from "../../utils/MyAudioRecorder"
import FullImageView from "../../utils/FullImageView"

const webHandler = new WebHandler()
var count = 0
class CheckDetailForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            refreshing: false,
            mediaFiles: [],
            isSoundPlaying: false,

            checkId: props.navigation.getParam("_id", ""),
            checkTitle: props.navigation.getParam("_title", ""),
            checkDetail: [],
            isError: false, errorMsg: "",
            checkQuesRefs: [],
            isFormSubmitting: false
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('_title'),
        }
    };

    componentDidMount() {
        this.setState({ isLoading: true })
        this.loadData()
    }

    loadData() {
        webHandler.getCheckListDetail(this.state.checkId,
            (responseJson) => {
                this.setState({
                    checkDetail: responseJson.data,
                    isLoading: false, refreshing: false
                })
            },
            (error) => {
                MyUtils.showSnackbar(error, "")
                this.setState({ isLoading: false, refreshing: false, isError: true, errorMsg: error })
            }
        )
    }

    renderItem(item, index) {
        return (
            <View style={{ marginHorizontal: 10 }}>
                <Text style={{
                    fontSize: 16, textAlign: "center",
                    fontWeight: "bold", marginVertical: 10
                }}>{item.productname}</Text>
                {item.questions.map((quest, q_index) => {
                    return (
                        <View key={q_index}>
                            {quest.question_type === "Choice" &&
                                <View style={{ flex: 1, flexDirection: "row", padding: 10, justifyContent: "center" }}>
                                    <Text style={{ fontSize: 16, fontWeight: "700", color: appPinkColor }}>
                                        {(q_index + 1) + ". "}
                                    </Text>
                                    <View style={{ flex: 1 }}>
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
                            <View style={{ width: "100%" }}>
                                <QuesDetailForm _quesData={quest} onResponse={(resp) => this.updateCheckResp(item.productid, resp)} />
                            </View>
                            <View style={{ height: 1, backgroundColor: "#ccc", marginHorizontal: 5 }} />
                        </View>
                    )
                })}

                <View style={[styles.round_white_bg_container, { marginTop: 10 }]}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 14, flex: 1, fontWeight: "bold", color: appPinkColor, marginBottom: 5 }}>Media Files</Text>
                        <TouchableOpacity
                            onPress={() => { this.refs._selectOptionModal.setModalVisible(true) }}
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
            </View>
        )
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
        return (
            <View style={styles.container}>
                {this.renderLoadingDialog()}
                {this.state.isLoading && MyUtils.renderLoadingView()}
                {(!this.state.isLoading && !this.state.isError && !MyUtils.isEmptyArray(this.state.checkDetail)) &&
                    <View style={{ flex: 1 }}>
                        {/* <FlatList
                            style={{ flex: 1 }}
                            data={this.state.checkDetail}
                            renderItem={({ item, index }) => this.renderItem(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                            onRefresh={() => this.handleRefresh()}
                            refreshing={this.state.refreshing}
                            onEndReached={() => this.handleLoadMore()}
                            onEndReachedThreshold={0.5}
                        /> */}

                        <ScrollView style={{ flex: 1 }}>
                            {this.renderItem(this.state.checkDetail[0], 0)}
                        </ScrollView>

                        <View style={{ flexDirection: "row", padding: 10 }}>
                            <Button
                                title="SUBMIT"
                                containerStyle={{ flex: 1 }}
                                buttonStyle={{ backgroundColor: "green", marginEnd: 5 }}
                                onPress={() => {
                                    this.verifyForSubmit(
                                        this.state.checkDetail[0].productid,
                                        this.state.checkDetail[0].questions)
                                }}
                            />
                            <Button
                                title="CANCEL"
                                style={{ width: "50%" }}
                                containerStyle={{ flex: 1 }}
                                buttonStyle={{ backgroundColor: "red", marginStart: 5 }}
                                onPress={() => { this.props.navigation.goBack() }}
                            />
                        </View>

                        <SelectOptionModal
                            ref="_selectOptionModal"
                            onItemPress={(type) => this.handleMediaFileAction(type)}
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
                {this.state.isError && MyUtils.renderErrorView(this.state.errorMsg, () => {
                    this.setState({ isLoading: true, isError: false })
                    this.loadData()
                })}
            </View>
        );
    }

    handleOnItemClick(quesData) {
        this.props.navigation.navigate("CheckDetail", {
            _checkId: this.state.checkId,
            _quesData: quesData
        })
    }

    handleRefresh() {
        this.setState({ refreshing: true })
        this.loadData()
    }

    handleLoadMore() {

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

        allResp.map((item, index) => {
            if (item.topicId == topicId) {
                topicResp.push(item)
            }
        })

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

        if (isAllOK) {
            this.submitData(JSON.stringify(topicResp))
        }
    }

    submitData(quesResp) {
        this.setState({ isFormSubmitting: true })
        webHandler.submitCheck(this.state.checkId,
            this.state.checkTitle, quesResp,
            (responseJson) => {
                MyUtils.showSnackbar("Form submitted successfully!", "")
                this.setState({ isFormSubmitting: false })
                this.props.navigation.state.params.onReload()
                this.props.navigation.goBack();
            }, error => {
                alert(error)
                this.setState({ isFormSubmitting: false })
            })

        // alert(quesResp) 
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
});

export default CheckDetailForm;