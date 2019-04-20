import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, } from "react-native";
// import Video from 'react-native-video';

import Video from 'react-native-af-video-player'

class MyVideoPlayer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videoUrl: props.navigation.getParam("_videoUri", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"),
            width: props.navigation.getParam("_videoWidth", 500),
            height: props.navigation.getParam("_videoHeigth", 500),
        };
    }

    render() {
        return (
            <View >
                <Video url={this.state.videoUrl} />
            </View>
        );
    }
}

export default MyVideoPlayer;