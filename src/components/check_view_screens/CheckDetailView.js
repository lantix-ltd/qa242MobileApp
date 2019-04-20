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
import QuesDetailView from "./QuesDetailView"
import MyAudioRecorder from "../../utils/MyAudioRecorder"
import FullImageView from "../../utils/FullImageView"

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

    renderSubmittedByView(data) {
        return (
            <View style={[styles.round_white_bg_container, { marginTop: 5 }]}>
                <Text style={{
                    fontSize: 16, fontWeight: "bold",
                    color: appPinkColor, marginBottom: 5
                }}>Submitted By</Text>
                {this.renderTVRow("Name", "Jahnzaib Ramzan")}
                {this.renderTVRow("Working Line(s)", "1")}
                {this.renderTVRow("Working Shift", "Morning")}
                {this.renderTVRow("Date & Time", "4 Jan 2019 12:00:00")}
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
                                <QuesDetailView _quesData={quest} />
                            </View>
                            <View style={{ height: 1, backgroundColor: "#ccc", marginHorizontal: 5 }} />
                        </View>
                    )
                })}

                <View style={[styles.round_white_bg_container, { marginTop: 10 }]}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 14, flex: 1, fontWeight: "bold", color: appPinkColor, marginBottom: 5 }}>Media Files</Text>
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

                        <ScrollView style={{ flex: 1 }}>
                            {this.renderSubmittedByView("dfsd")}
                            {this.renderCheckView(this.state.checkDetail[0], 0)}
                        </ScrollView>

                        <View style={{ flexDirection: "row", padding: 10 }}>
                            <Button
                                title="REVIEWED"
                                containerStyle={{ flex: 1 }}
                                buttonStyle={{ backgroundColor: "green", marginEnd: 5 }}
                                onPress={() => { this.acceptData() }}
                            />
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
        );
    }

    acceptData() {
        MyUtils.showSnackbar("Added to reviewed successfully", "")
        this.props.navigation.goBack()
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