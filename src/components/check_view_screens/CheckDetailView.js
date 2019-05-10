import React, { Component } from "react";
import {
    View, Text, Image, StyleSheet, TextInput, ScrollView,
    SafeAreaView, TouchableOpacity, ActivityIndicator
} from "react-native";
import { Button } from 'react-native-elements'
import Modal from "react-native-modal";
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Feather';

import { appPinkColor, appYellowColor, appGreyColor } from "../../utils/AppStyles";
import MyUtils from "../../utils/MyUtils";
import WebHandler from "../../data/remote/WebHandler"
import QuesDetailView from "./QuesDetailView"
import FullImageView from "../../utils/FullImageView"
import PrefManager from "../../data/local/PrefManager"

const prefManager = new PrefManager()
const webHandler = new WebHandler()
var count = 0
class CheckDetailView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            refreshing: false,
            mediaFiles: [],
            isSoundPlaying: false,

            checkId: props.navigation.getParam("_id", ""),
            checkTitle: props.navigation.getParam("_title", ""),
            userRole: props.navigation.getParam("_user_type", ""),
            checkDetail: [],
            isError: false, errorMsg: "",
            checkQuesRefs: [],
            isFormSubmitting: false,
            reviewerComment: ""
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

    renderTVRow(title, value) {
        return (
            <View style={{ flexDirection: "row" }}>
                <Text style={{ flex: 1, fontSize: 15 }}>
                    {title}
                </Text>
                <Text style={{ flex: 1, fontSize: 17, color: "#000" }}>
                    {value}
                </Text>
            </View>
        )
    }

    renderSubmittedByView(lineNo, shiftNo, fullName, dateTime) {
        return (
            <View style={[styles.round_white_bg_container, { marginTop: 5 }]}>
                <Text style={{
                    fontSize: 16, fontWeight: "bold",
                    color: appPinkColor, marginBottom: 5
                }}>Submitted By:</Text>
                {fullName != undefined && this.renderTVRow("Name", fullName)}
                {lineNo != undefined && this.renderTVRow("Working Line(s)", lineNo)}
                {shiftNo != undefined && this.renderTVRow("Working Shift", shiftNo)}
                {dateTime != undefined && this.renderTVRow("Date & Time", dateTime)}
            </View>
        )
    }

    renderCommentView() {
        return (
            <View style={[styles.round_white_bg_container, { marginTop: 5 }]}>
                <Text style={{
                    fontSize: 16, fontWeight: "bold",
                    color: appPinkColor, marginBottom: 5
                }}>Your Comment (If Any) :</Text>
                <TextInput style={{ backgroundColor: "#FFF", textAlignVertical: "top" }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType='number-pad'
                    returnKeyType="done"
                    value={this.state.reviewerComment}
                    numberOfLines={1}
                    multiline={false}
                    placeholder='Type here'
                    onChangeText={(text) => this.setState({ reviewerComment: text })}
                    placeholderTextColor='#797979' />
            </View>
        )
    }

    renderCheckView(item, index) {
        return (
            <View style={{ marginHorizontal: 10 }}>
                <Text style={{
                    fontSize: 16, textAlign: "center",
                    fontWeight: "bold", marginVertical: 10
                }}>{item.productname}</Text>
                {item.questions.map((quest, q_index) => {
                    return (
                        <View key={q_index}>
                            {(quest.question_type === "Dropdown" || quest.question_type === "Fixed") &&
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
                                <QuesDetailView _quesData={quest} />
                            </View>
                            <View style={{ height: 1, backgroundColor: "#ccc", marginHorizontal: 5 }} />
                        </View>
                    )
                })}

                <View style={[styles.round_white_bg_container, { marginTop: 10 }]}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 14, flex: 1, fontWeight: "bold", color: appPinkColor, marginBottom: 5 }}>Media Files:</Text>
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
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {this.renderLoadingDialog()}
                    {this.state.isLoading && MyUtils.renderLoadingView()}
                    {(!this.state.isLoading && !this.state.isError && !MyUtils.isEmptyArray(this.state.checkDetail)) &&
                        <View style={{ flex: 1 }}>

                            <ScrollView style={{ flex: 1 }}>
                                {this.renderCheckView(this.state.checkDetail[0], 0)}
                                {this.renderSubmittedByView(
                                    this.state.checkDetail[0].line_no,
                                    this.state.checkDetail[0].shift_no,
                                    this.state.checkDetail[0].full_name,
                                    this.state.checkDetail[0].complete_datetime
                                )}
                                {this.renderCommentView()}
                            </ScrollView>

                            <View style={{ flexDirection: "row", padding: 10 }}>
                                {this.state.userRole == prefManager.EDITOR &&
                                    <Button
                                        title="REVIEWED"
                                        containerStyle={{ flex: 1 }}
                                        buttonStyle={{ backgroundColor: "green", marginEnd: 5 }}
                                        onPress={() => { this.acceptDataForReview() }}
                                    />
                                }
                                {this.state.userRole == prefManager.ADMIN &&
                                    <Button
                                        title="APPROVED"
                                        containerStyle={{ flex: 1 }}
                                        buttonStyle={{ backgroundColor: "green", marginEnd: 5 }}
                                        onPress={() => { this.acceptDataForApproval() }}
                                    />
                                }
                                <Button
                                    title="CANCEL"
                                    style={{ width: "50%" }}
                                    containerStyle={{ flex: 1 }}
                                    buttonStyle={{ backgroundColor: "red", marginStart: 5 }}
                                    onPress={() => { this.props.navigation.goBack() }}
                                />
                            </View>

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
            </SafeAreaView>
        );
    }

    acceptDataForReview() {
        this.setState({ isFormSubmitting: true })
        webHandler.submitAsReviewd(this.state.checkId, this.state.reviewerComment,
            (responseJson) => {
                MyUtils.showSnackbar("Added to reviewed successfully", "")
                this.setState({ isFormSubmitting: false })
                this.props.navigation.state.params.onReload()
                this.props.navigation.goBack();
            }, (error) => {
                MyUtils.showCustomAlert("Check Review Failed", error)
                this.setState({ isFormSubmitting: false })
            })
    }

    acceptDataForApproval() {
        this.setState({ isFormSubmitting: true })
        webHandler.submitAsApproved(this.state.checkId, this.state.reviewerComment,
            (responseJson) => {
                MyUtils.showSnackbar("Added to approved successfully", "")
                this.setState({ isFormSubmitting: false })
                this.props.navigation.state.params.onReload()
                this.props.navigation.goBack();
            }, (error) => {
                MyUtils.showCustomAlert("Check Approve Failed", error)
                this.setState({ isFormSubmitting: false })
            })
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
            </View>
        )
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

export default CheckDetailView;