import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Platform,
} from 'react-native';
import Modal from "react-native-modal";
import Sound from 'react-native-sound';
import { Button } from 'react-native-elements'
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { appPinkColor, appYellowColor } from './AppStyles';

class MyAudioRecorder extends Component {

    state = {
        modalVisible: false,
        currentTime: 0.0,
        recording: false,
        paused: false,
        stoppedRecording: false,
        finished: false,
        audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
        hasPermission: undefined,
        finalRecordeddFile: ""
    };

    prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    componentDidMount() {

    }

    init() {
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({
                currentTime: 0.0,
                recording: false,
                paused: false,
                stoppedRecording: false,
                finished: false,
                hasPermission: isAuthorised,
            });

            if (!isAuthorised) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({ currentTime: Math.floor(data.currentTime) });
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
            };
        });
    }

    async _pause() {
        if (!this.state.recording) {
            console.warn('Can\'t pause, not recording!');
            return;
        }

        try {
            const filePath = await AudioRecorder.pauseRecording();
            this.setState({ paused: true });
        } catch (error) {
            console.error(error);
        }
    }

    async _resume() {
        if (!this.state.paused) {
            console.warn('Can\'t resume, not paused!');
            return;
        }

        try {
            await AudioRecorder.resumeRecording();
            this.setState({ paused: false });
        } catch (error) {
            console.error(error);
        }
    }

    async _stop() {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({ stoppedRecording: true, recording: false, paused: false });

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }

    async _play() {
        if (this.state.recording) {
            await this._stop();
        }
        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            var sound = new Sound(this.state.audioPath, '', (error) => {
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

    async _record() {
        if (this.state.recording) {
            console.warn('Already recording!');
            return;
        }

        if (!this.state.hasPermission) {
            console.warn('Can\'t record, no permission granted!');
            return;
        }

        if (this.state.stoppedRecording) {
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({ recording: true, paused: false });

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }

    _finishRecording(didSucceed, filePath, fileSize) {
        this.setState({ finished: didSucceed, finalRecordeddFile: filePath });
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    }

    render() {
        return (
            <Modal
                isVisible={this.state.modalVisible}
                onBackdropPress={() => this.setState({ modalVisible: false })}
                onBackButtonPress={() => this.setState({ modalVisible: false })}
            >
                <View style={styles.container}>
                    <View style={styles.controls}>

                        {(!this.state.recording && !this.state.stoppedRecording) &&
                            <Button
                                containerStyle={styles.btnContainerStyle}
                                title="RECORD"
                                onPress={() => this._record()}
                            />
                        }

                        {this.state.recording &&
                            <Button
                                containerStyle={styles.btnContainerStyle}
                                title="STOP"
                                onPress={() => this._stop()}
                            />
                        }

                        {this.state.stoppedRecording &&
                            <View>
                                <Button
                                    containerStyle={styles.btnContainerStyle}
                                    title="PLAY"
                                    onPress={() => this._play()}
                                />
                                <Button
                                    containerStyle={styles.btnContainerStyle}
                                    title="DONE"
                                    onPress={() => this.handleOnDone()}
                                />
                                <Button
                                    containerStyle={styles.btnContainerStyle}
                                    title="DISCARD"
                                    onPress={() => this.init()}
                                />
                            </View>
                        }
                        <Text style={styles.progressText}>{this.state.currentTime}s</Text>
                    </View>
                </View>
            </Modal>
        );
    }

    setModalVisible(visible) {
        var fileName = "/AUD_" + Date.now() + ".aac"
        this.setState({
            modalVisible: visible,
            audioPath: AudioUtils.DocumentDirectoryPath + fileName,
            hasPermission: undefined,
        });
        this.init()
    }

    onCancel() {
        this.setState({ modalVisible: false, })
    }

    handleOnDone() {
        this.props.onDone(this.state.finalRecordeddFile)
        this.onCancel()
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    controls: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        paddingTop: 50,
        fontSize: 50,
        color: appPinkColor
    },
    btnContainerStyle: {
        marginBottom: 5, width: 200
    }
});

export default MyAudioRecorder;